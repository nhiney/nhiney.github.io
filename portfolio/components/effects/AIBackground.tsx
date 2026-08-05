"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./AIBackground.module.css";

const FUSION_PROTOCOL_SLUG = "fusion-protocol";

const VERTEX_SHADER = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_motion;
uniform float u_dark;
uniform float u_steps;

#define PI 3.14159265359
#define TAU 6.28318530718

float saturate(float value) {
  return clamp(value, 0.0, 1.0);
}

mat2 rotate2d(float angle) {
  float cosine = cos(angle);
  float sine = sin(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  local = local * local * (3.0 - 2.0 * local);

  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));

  return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
}

float fbm(vec2 point) {
  float value = 0.0;
  float amplitude = 0.52;

  for (int octave = 0; octave < 4; octave++) {
    value += valueNoise(point) * amplitude;
    point = rotate2d(0.57) * point * 2.03 + 3.17;
    amplitude *= 0.5;
  }

  return value;
}

vec3 spectrum(float amount) {
  amount = fract(amount);
  vec3 cyan = vec3(0.08, 0.82, 1.0);
  vec3 blue = vec3(0.18, 0.42, 1.0);
  vec3 violet = vec3(0.55, 0.26, 1.0);
  vec3 ice = vec3(0.62, 0.92, 1.0);

  if (amount < 0.34) return mix(cyan, blue, amount / 0.34);
  if (amount < 0.7) return mix(blue, violet, (amount - 0.34) / 0.36);
  return mix(violet, ice, (amount - 0.7) / 0.3);
}

float sparseStars(vec2 uv, float time, float threshold) {
  vec2 grid = uv * vec2(104.0, 58.0);
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float random = hash21(cell);
  vec2 offset = vec2(
    hash21(cell + 7.13),
    hash21(cell + 19.71)
  ) - 0.5;
  float distanceToStar = length(local - offset * 0.72);
  float star = smoothstep(0.055, 0.0, distanceToStar) * step(threshold, random);
  float twinkle = 0.58 + 0.42 * sin(time * (0.45 + random * 0.8) + random * TAU);
  return star * twinkle;
}

float textSafeMask(vec2 uv, float strength) {
  vec2 delta = (uv - vec2(0.31, 0.43)) / vec2(0.23, 0.29);
  float pocket = exp(-dot(delta, delta) * 1.65);
  return 1.0 - pocket * strength;
}

vec3 spectralHelix(vec2 uv, vec2 point, float time, out float energy) {
  vec2 orbitPoint = rotate2d(-0.09 + u_pointer.x * 0.018) *
    (point - vec2(0.1 + u_pointer.x * 0.025, 0.015 + u_pointer.y * 0.018));
  vec2 ellipsePoint = orbitPoint * vec2(0.73, 1.08);
  float radius = length(ellipsePoint);
  float angle = atan(ellipsePoint.y, ellipsePoint.x);
  float noiseWarp = (fbm(ellipsePoint * 4.2 + time * 0.025) - 0.5) * 0.028;

  float primaryRadius = 0.49 + 0.064 * sin(angle * 2.0 - time * 0.1) + noiseWarp;
  float secondaryRadius = 0.68 + 0.038 * sin(angle * 3.0 + time * 0.065);
  float primaryDistance = abs(radius - primaryRadius);
  float secondaryDistance = abs(radius - secondaryRadius);

  float primaryGlow = exp(-primaryDistance * 10.5);
  float primaryCore = exp(-primaryDistance * 78.0);
  float secondaryGlow = exp(-secondaryDistance * 12.0);
  float secondaryCore = exp(-secondaryDistance * 92.0);

  float primaryStrands = pow(
    0.5 + 0.5 * cos(primaryDistance * 225.0 - angle * 18.0 + time * 1.15),
    14.0
  ) * exp(-primaryDistance * 18.0);
  float secondaryStrands = pow(
    0.5 + 0.5 * cos(secondaryDistance * 260.0 + angle * 23.0 - time * 0.82),
    18.0
  ) * exp(-secondaryDistance * 20.0);

  vec2 sweepPoint = rotate2d(-0.24) * (point - vec2(-0.02, 0.02));
  float sweepCenter =
    0.16 * sin(sweepPoint.x * 2.35 + time * 0.11) +
    0.045 * sin(sweepPoint.x * 5.4 - time * 0.16);
  float sweepDistance = abs(sweepPoint.y - sweepCenter);
  float sweepGlow = exp(-sweepDistance * 12.0) * smoothstep(1.08, 0.05, abs(sweepPoint.x));
  float sweepCore = exp(-sweepDistance * 84.0);
  float sweepStrands = pow(
    0.5 + 0.5 * cos(sweepDistance * 240.0 - sweepPoint.x * 19.0 - time * 1.4),
    16.0
  ) * sweepGlow;

  float pulse = pow(
    max(0.0, sin(angle * 9.0 - radius * 18.0 - time * 1.7)),
    28.0
  ) * (primaryCore + secondaryCore);

  vec3 primaryColor = spectrum(angle / TAU + time * 0.014 + 0.13);
  vec3 secondaryColor = spectrum(angle / TAU - time * 0.009 + 0.58);
  vec3 sweepColor = spectrum(uv.x * 0.58 + uv.y * 0.16 + time * 0.01);

  vec3 color = vec3(0.0);
  color += primaryColor * (primaryGlow * 0.15 + primaryCore * 0.7 + primaryStrands * 0.34);
  color += secondaryColor * (secondaryGlow * 0.1 + secondaryCore * 0.47 + secondaryStrands * 0.23);
  color += sweepColor * (sweepGlow * 0.1 + sweepCore * 0.48 + sweepStrands * 0.26);
  color += vec3(0.72, 0.94, 1.0) * pulse * 1.4;

  float stars = sparseStars(uv + vec2(time * 0.0009, 0.0), time, 0.986);
  color += spectrum(hash21(floor(uv * 80.0))) * stars * 0.9;

  float safe = textSafeMask(uv, 0.62);
  color *= safe;
  energy = saturate(
    primaryGlow * 0.7 + secondaryGlow * 0.42 + sweepGlow * 0.55 + stars
  );

  return color;
}

vec3 neuralVeil(vec2 uv, vec2 point, float time, out float energy) {
  vec2 veilPoint = rotate2d(-0.34 + u_pointer.x * 0.022) *
    (point - vec2(0.1 + u_pointer.x * 0.02, 0.02 + u_pointer.y * 0.016));
  float fold =
    0.115 * sin(veilPoint.x * 2.2 + time * 0.14) +
    0.052 * sin(veilPoint.x * 5.1 - time * 0.1) +
    0.026 * sin(veilPoint.x * 9.4 + time * 0.07);
  float across = veilPoint.y - fold;
  float band = smoothstep(0.64, 0.045, abs(across));
  float depth = 0.5 + 0.5 * sin(
    veilPoint.x * 3.25 + across * 5.4 + time * 0.2
  );

  vec2 warped = vec2(
    veilPoint.x + 0.045 * sin(across * 5.0 + time * 0.16),
    across + 0.038 * sin(veilPoint.x * 5.7 - time * 0.13)
  );
  vec2 grid = warped * vec2(25.0, 31.0);
  vec2 gridCell = abs(fract(grid) - 0.5);
  float verticalLine = exp(-gridCell.x * 44.0);
  float horizontalLine = exp(-gridCell.y * 42.0);
  float focus = 0.22 + 0.78 * smoothstep(-0.82, 0.8, veilPoint.x);
  float mesh = (verticalLine * 0.44 + horizontalLine * 0.72) *
    band * (0.22 + 0.78 * depth) * focus;

  vec2 nodeCell = fract(grid) - 0.5;
  float node = exp(-length(nodeCell) * 21.0) *
    step(0.32, hash21(floor(grid))) * band * focus;
  float ridge = pow(
    0.5 + 0.5 * sin(veilPoint.x * 5.4 - across * 8.1 + time * 0.32),
    15.0
  ) * band;

  float filamentA = abs(across + 0.33 - 0.045 * sin(veilPoint.x * 3.3 + time * 0.19));
  float filamentB = abs(across - 0.01 - 0.052 * sin(veilPoint.x * 3.8 - time * 0.16));
  float filamentC = abs(across - 0.34 - 0.038 * sin(veilPoint.x * 4.2 + time * 0.12));
  float filamentGlow =
    exp(-filamentA * 18.0) +
    exp(-filamentB * 19.0) +
    exp(-filamentC * 18.0);
  float filamentCore =
    exp(-filamentA * 105.0) +
    exp(-filamentB * 112.0) +
    exp(-filamentC * 102.0);
  float packet = pow(
    max(0.0, sin(veilPoint.x * 13.0 - time * 2.1 + across * 4.0)),
    30.0
  ) * filamentCore;

  vec3 lowColor = vec3(0.06, 0.78, 1.0);
  vec3 middleColor = vec3(0.16, 0.42, 1.0);
  vec3 highColor = vec3(0.57, 0.3, 1.0);
  vec3 veilColor = across < 0.0
    ? mix(lowColor, middleColor, saturate(across + 1.0))
    : mix(middleColor, highColor, saturate(across * 1.5));

  vec3 color = veilColor * (mesh * 0.34 + node * 0.55 + ridge * 0.2);
  color += mix(lowColor, highColor, saturate(across + 0.5)) *
    (filamentGlow * 0.13 + filamentCore * 0.72);
  color += vec3(0.78, 0.95, 1.0) * packet * 1.2;

  float bokeh = sparseStars(uv * vec2(1.0, 0.94), time * 0.55, 0.991);
  color += vec3(0.2, 0.55, 1.0) * bokeh * 0.42;

  float safe = textSafeMask(uv, 0.78);
  color *= safe;
  energy = saturate(mesh * 0.8 + filamentGlow * 0.62 + node + bokeh * 0.5);

  return color;
}

vec3 lensLocal(vec3 position) {
  position -= vec3(
    0.43 + u_pointer.x * 0.055,
    -0.015 - u_pointer.y * 0.035,
    0.0
  );
  position.yz = rotate2d(-0.23 - u_pointer.y * 0.045) * position.yz;
  position.xz = rotate2d(0.32 + u_pointer.x * 0.064) * position.xz;
  position.xy = rotate2d(-0.075) * position.xy;
  position.x /= 1.14;
  return position;
}

float lensDistance(vec3 position, float time) {
  vec3 local = lensLocal(position);
  float majorAngle = atan(local.y, local.x);
  float wobble = 0.012 * sin(majorAngle * 5.0 - time * 0.17);
  vec2 torus = vec2(length(local.xy) - (0.69 + wobble), local.z);
  return (length(torus) - 0.105) * 0.82;
}

vec3 lensNormal(vec3 position, float time) {
  float epsilon = 0.0024;
  vec2 stepSize = vec2(epsilon, 0.0);
  return normalize(vec3(
    lensDistance(position + stepSize.xyy, time) - lensDistance(position - stepSize.xyy, time),
    lensDistance(position + stepSize.yxy, time) - lensDistance(position - stepSize.yxy, time),
    lensDistance(position + stepSize.yyx, time) - lensDistance(position - stepSize.yyx, time)
  ));
}

float diamondEdge(vec2 point, vec2 center, float angle, vec2 size) {
  vec2 local = rotate2d(angle) * (point - center);
  float distanceToBox = max(abs(local.x) - size.x, abs(local.y) - size.y);
  return exp(-abs(distanceToBox) * 180.0);
}

vec3 quantumLens(vec2 uv, vec2 point, float time, out float energy) {
  vec2 projected = rotate2d(-0.08) * (point - vec2(0.39, 0.005));
  vec2 projectedEllipse = projected * vec2(0.76, 1.14);
  float projectedRadius = length(projectedEllipse);
  float ringDistance = abs(projectedRadius - 0.53);
  vec3 origin = vec3(0.0, 0.0, 2.72);
  vec3 direction = normalize(vec3(point * 0.94, -2.18));
  float travel = 0.0;
  float hit = 0.0;
  vec3 position = origin;

  // The glass torus only occupies a projected annulus. Skipping the empty
  // center and corners saves most ray-march work without changing its edge.
  if (ringDistance < 0.255) {
    for (int stepIndex = 0; stepIndex < 40; stepIndex++) {
      if (float(stepIndex) >= u_steps) break;
      position = origin + direction * travel;
      float distanceToLens = lensDistance(position, time);
      if (distanceToLens < 0.0028) {
        hit = 1.0;
        break;
      }
      travel += clamp(distanceToLens * 0.76, 0.008, 0.2);
      if (travel > 5.2) break;
    }
  }

  vec3 color = vec3(0.0);
  float lensEnergy = 0.0;

  if (hit > 0.5) {
    vec3 normal = lensNormal(position, time);
    vec3 local = lensLocal(position);
    float majorAngle = atan(local.y, local.x);
    float minorAngle = atan(local.z, length(local.xy) - 0.69);
    float facing = saturate(dot(normal, -direction));
    float fresnel = 0.028 + 0.972 * pow(1.0 - facing, 5.0);
    float caustic = pow(
      0.5 + 0.5 * cos(majorAngle * 7.0 - minorAngle * 2.2 + time * 0.22),
      18.0
    );
    float goldFlash = pow(
      max(0.0, sin(majorAngle * 3.0 + minorAngle * 4.0 - time * 0.12)),
      44.0
    );
    vec3 chroma = spectrum(majorAngle / TAU + minorAngle * 0.08 + time * 0.008);
    vec3 reflected = spectrum(0.58 + normal.y * 0.2 + normal.x * 0.08);
    color += mix(chroma * 0.2, reflected, fresnel) * (0.36 + fresnel * 1.42);
    color += chroma * caustic * 1.15;
    color += vec3(1.0, 0.58, 0.16) * goldFlash * 0.24;
    color += vec3(0.64, 0.9, 1.0) * pow(1.0 - facing, 2.6) * 0.72;
    lensEnergy = saturate(fresnel + caustic * 0.8);
  }

  float outerGlow = exp(-ringDistance * 12.0);
  float spectralEdge = exp(-ringDistance * 76.0);
  vec3 ringColor = spectrum(atan(projectedEllipse.y, projectedEllipse.x) / TAU + 0.62);
  color += ringColor * (outerGlow * 0.08 + spectralEdge * 0.5);

  float horizon = smoothstep(0.6, 0.98, uv.y);
  float floorNoise = fbm(vec2(uv.x * 8.0, uv.y * 28.0 - time * 0.08));
  float reflection = outerGlow * horizon * (0.25 + floorNoise * 0.75);
  float floorStreak = pow(
    max(0.0, sin(uv.x * 82.0 + floorNoise * 8.0 - time * 0.7)),
    28.0
  ) * horizon;
  color += ringColor * reflection * 0.26;
  color += vec3(0.08, 0.65, 1.0) * floorStreak * 0.12;

  float beamSeed = hash21(vec2(floor(uv.x * 38.0), 4.0));
  float beamLocal = abs(fract(uv.x * 38.0) - 0.5);
  float verticalBeam = exp(-beamLocal * 38.0) *
    step(0.84, beamSeed) * smoothstep(0.18, 0.98, uv.y);
  color += spectrum(beamSeed) * verticalBeam * 0.16;

  float shards = 0.0;
  shards += diamondEdge(point, vec2(-0.72, 0.05), 0.62 + time * 0.025, vec2(0.016, 0.034));
  shards += diamondEdge(point, vec2(-0.48, -0.29), -0.4 - time * 0.02, vec2(0.011, 0.026));
  shards += diamondEdge(point, vec2(0.91, -0.04), 0.28 + time * 0.018, vec2(0.014, 0.032));
  shards += diamondEdge(point, vec2(0.74, 0.32), -0.74 + time * 0.022, vec2(0.01, 0.022));
  color += vec3(0.12, 0.72, 1.0) * shards * 0.34;

  float safe = textSafeMask(uv, 0.86);
  color *= safe;
  energy = saturate(lensEnergy + outerGlow * 0.6 + reflection + verticalBeam + shards);

  return color;
}

vec3 fusionPalette(float amount) {
  amount = fract(amount);
  vec3 abyssInk = vec3(0.004, 0.022, 0.03);
  vec3 deepTeal = vec3(0.018, 0.13, 0.18);
  vec3 auroraJade = vec3(0.06, 0.38, 0.34);
  vec3 moonMint = vec3(0.48, 0.82, 0.72);
  vec3 champagne = vec3(0.94, 0.72, 0.36);

  if (amount < 0.28) {
    return mix(abyssInk, deepTeal, amount / 0.28);
  }
  if (amount < 0.6) {
    return mix(deepTeal, auroraJade, (amount - 0.28) / 0.32);
  }
  if (amount < 0.84) {
    return mix(auroraJade, moonMint, (amount - 0.6) / 0.24);
  }
  if (amount < 0.92) {
    return mix(moonMint, champagne, (amount - 0.84) / 0.08);
  }
  return mix(champagne, abyssInk, (amount - 0.92) / 0.08);
}

float fusionTextSafeMask(vec2 uv, float strength) {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  float portrait = 1.0 - smoothstep(0.82, 1.12, aspect);
  vec2 center = mix(vec2(0.31, 0.43), vec2(0.5, 0.32), portrait);
  vec2 radius = mix(vec2(0.23, 0.29), vec2(0.43, 0.28), portrait);
  vec2 delta = (uv - center) / radius;
  float pocket = exp(-dot(delta, delta) * 1.65);
  return 1.0 - pocket * strength;
}

vec3 fusionMicroParticles(
  vec2 uv,
  float time,
  float fieldMask,
  out float particleEnergy
) {
  float columns = clamp(floor(u_resolution.x / 3.5), 115.0, 330.0);
  vec2 gridCount = vec2(
    columns,
    columns * u_resolution.y / max(1.0, u_resolution.x)
  );
  vec2 flowUv = uv + vec2(
    time * 0.00065 + 0.0045 * sin(uv.y * 10.0 + time * 0.16 + 7.13),
    -time * 0.00032 + 0.0034 * sin(uv.x * 8.0 - time * 0.14 + 19.71)
  );
  vec2 grid = flowUv * gridCount;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float seed = hash21(cell + vec2(7.13, 19.71));
  float depth = hash21(cell + vec2(56.88, 90.54));
  vec2 offset = vec2(
    hash21(cell + vec2(18.83, 24.01)),
    hash21(cell + vec2(36.23, 37.51))
  ) - 0.5;
  vec2 starDelta = local - offset * 0.36;
  float distanceToDot = length(starDelta);
  float pixelFloor = min(
    0.15,
    0.34 * gridCount.x / max(1.0, u_resolution.x)
  );
  float size = max(mix(0.045, 0.085, depth), pixelFloor);
  float visible = step(0.22, seed);
  float dot = (1.0 - smoothstep(size * 0.16, size, distanceToDot)) * visible;
  float twinkle = 0.55 + 0.45 * sin(
    time * (0.42 + depth * 0.56) + seed * TAU + 7.13
  );
  float mediumStar = step(0.94, seed);
  float rareStar = step(0.991, seed);
  float sparklePulse = pow(
    max(0.0, sin(time * (0.94 + depth * 0.58) + seed * TAU)),
    10.0
  );
  float haloOuter = min(size * 2.35, 0.28);
  float halo = (1.0 - smoothstep(size * 1.05, haloOuter, distanceToDot)) *
    rareStar;
  vec3 dotColor = mix(
    vec3(0.035, 0.13, 0.16),
    vec3(0.08, 0.28, 0.3),
    step(0.78, seed)
  );
  dotColor = mix(
    dotColor,
    vec3(0.48, 0.82, 0.72),
    mediumStar
  );
  dotColor = mix(
    dotColor,
    vec3(0.94, 0.72, 0.36),
    rareStar
  );

  float nearColumns = clamp(floor(u_resolution.x / 14.8), 44.0, 108.0);
  vec2 nearGridCount = vec2(
    nearColumns,
    nearColumns * u_resolution.y / max(1.0, u_resolution.x)
  );
  vec2 nearFlowUv =
    uv +
    vec2(-time * 0.00155, time * 0.00095) +
    u_pointer * vec2(0.0065, 0.0045);
  vec2 nearGrid = nearFlowUv * nearGridCount;
  vec2 nearCell = floor(nearGrid);
  vec2 nearLocal = fract(nearGrid) - 0.5;
  float nearSeed = hash21(nearCell + vec2(61.7, 13.5));
  float nearDepth = fract(nearSeed * 17.37 + 0.13);
  vec2 nearOffset = vec2(
    fract(nearSeed * 31.17),
    fract(nearSeed * 67.41)
  ) - 0.5;
  vec2 nearDelta = nearLocal - nearOffset * 0.7;
  float nearDistance = length(nearDelta);
  float nearPixelFloor = min(
    0.18,
    0.55 * nearGridCount.x / max(1.0, u_resolution.x)
  );
  float nearSize = max(mix(0.075, 0.145, nearDepth), nearPixelFloor);
  float nearCore = (
    1.0 - smoothstep(nearSize * 0.12, nearSize, nearDistance)
  ) * step(0.86, nearSeed);
  float heroStar = step(0.988, nearSeed);
  float nearHalo = (
    1.0 - smoothstep(
      nearSize * 0.95,
      min(0.4, nearSize * 4.6),
      nearDistance
    )
  ) * heroStar;
  float rayX = 1.0 - smoothstep(0.006, 0.028, abs(nearDelta.x));
  float rayY = 1.0 - smoothstep(0.006, 0.028, abs(nearDelta.y));
  float rayEnvelope = 1.0 - smoothstep(
    nearSize * 0.62,
    min(0.4, nearSize * 4.2),
    nearDistance
  );
  float crossFlare = (rayX + rayY) * rayEnvelope * heroStar;
  float nearTwinkle = 0.72 + 0.28 * sin(
    time * (1.05 + nearDepth * 0.92) + nearSeed * TAU
  );
  float heroPulse = pow(
    max(0.0, sin(time * 1.65 + nearSeed * TAU)),
    11.0
  );
  vec3 nearColor = mix(
    vec3(0.07, 0.22, 0.24),
    vec3(0.62, 0.88, 0.78),
    step(0.63, nearDepth)
  );
  nearColor = mix(
    nearColor,
    vec3(0.96, 0.76, 0.38),
    heroStar
  );

  float weightedCore = dot * (0.35 + depth * 0.65);
  particleEnergy = saturate(
    (
      weightedCore * 0.4 +
      nearCore * 0.8 +
      nearHalo * 0.18 +
      crossFlare * 0.05
    ) * fieldMask
  );
  return (
    dotColor * weightedCore * (0.08 + twinkle * 0.2) +
    vec3(0.48, 0.82, 0.72) * mediumStar * dot *
      (0.055 + sparklePulse * 0.13) +
    vec3(0.94, 0.72, 0.36) * halo * (0.05 + sparklePulse * 0.085) +
    nearColor * nearCore * (0.3 + nearTwinkle * 0.58) +
    vec3(0.62, 0.88, 0.78) * nearHalo * (0.11 + heroPulse * 0.27) +
    vec3(0.96, 0.76, 0.38) * crossFlare *
      (0.055 + heroPulse * 0.2)
  ) * fieldMask;
}

vec3 fusionMagicSparkles(
  vec2 uv,
  float time,
  float fieldMask,
  out float sparkleEnergy
) {
  float columns = clamp(floor(u_resolution.x / 21.5), 34.0, 76.0);
  vec2 gridCount = vec2(
    columns,
    columns * u_resolution.y / max(1.0, u_resolution.x)
  );
  vec2 flowUv =
    uv +
    vec2(time * 0.0023, -time * 0.00125) +
    u_pointer * vec2(0.011, 0.0075);
  vec2 grid = flowUv * gridCount;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float seed = hash21(cell + vec2(83.17, 41.39));
  float depth = fract(seed * 17.37 + 0.13);
  vec2 offset = vec2(
    fract(seed * 31.17),
    fract(seed * 67.41)
  ) - 0.5;
  vec2 delta = local - offset * 0.64;
  float distanceToStar = length(delta);
  float pixelFloor = min(
    0.2,
    0.68 * gridCount.x / max(1.0, u_resolution.x)
  );
  float size = max(mix(0.09, 0.16, depth), pixelFloor);
  float visible = step(0.89, seed);
  float hero = step(0.97, seed);
  float crown = step(0.996, seed);
  float core = (
    1.0 - smoothstep(size * 0.1, size, distanceToStar)
  ) * visible;
  float twinkle = 0.42 + 0.58 * pow(
    max(0.0, sin(time * (1.35 + depth * 0.62) + seed * TAU)),
    10.0
  );
  float flash = pow(
    max(0.0, sin(time * 0.72 + seed * 91.7)),
    20.0
  );
  float halo = (
    1.0 - smoothstep(size, min(0.4, size * 4.6), distanceToStar)
  ) * hero;
  float rayEnvelope = 1.0 - smoothstep(
    size * 0.55,
    min(0.42, size * 4.2),
    distanceToStar
  );
  float rayX = 1.0 - smoothstep(0.006, 0.032, abs(delta.x));
  float rayY = 1.0 - smoothstep(0.006, 0.032, abs(delta.y));
  vec2 diagonal = rotate2d(0.785398) * delta;
  float diagonalRays = (
    1.0 - smoothstep(0.007, 0.038, min(abs(diagonal.x), abs(diagonal.y)))
  ) * crown;
  float cross = (rayX + rayY + diagonalRays * 0.48) * rayEnvelope * hero;
  vec3 starColor = mix(
    vec3(0.35, 0.78, 0.72),
    vec3(0.96, 0.72, 0.34),
    step(0.58, depth)
  );
  starColor = mix(starColor, vec3(0.98, 0.86, 0.52), crown);
  float safe = fusionTextSafeMask(uv, 0.9);
  float maskedField = fieldMask * safe;

  sparkleEnergy = saturate(
    (core * 0.82 + halo * 0.42 + cross * 0.2) * maskedField
  );
  return (
    starColor * core * (0.28 + twinkle * 0.56) +
    vec3(0.58, 0.9, 0.8) * halo * (0.12 + twinkle * 0.34) +
    vec3(0.9, 0.78, 0.43) * cross * (0.07 + twinkle * 0.24) +
    vec3(0.98, 0.86, 0.52) * halo * crown * (0.18 + flash * 0.65)
  ) * maskedField;
}

vec2 fusionGalaxyUvCenter(float portrait) {
  return mix(vec2(0.72, 0.53), vec2(0.5, 0.67), portrait);
}

vec3 fusionGalaxy(
  vec2 uv,
  float time,
  out float galaxyEnergy,
  out float galaxyStarMask
) {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  float portrait = 1.0 - smoothstep(0.82, 1.12, aspect);
  vec2 galaxyCenter = fusionGalaxyUvCenter(portrait);
  galaxyCenter += vec2(
    u_pointer.x * mix(0.006, 0.002, portrait),
    -u_pointer.y * mix(0.004, 0.0015, portrait)
  );
  vec2 galaxyPoint = uv - galaxyCenter;
  galaxyPoint.x *= aspect;
  galaxyPoint = rotate2d(mix(-0.25, -0.08, portrait)) * galaxyPoint;
  galaxyPoint.y *= mix(1.2, 1.05, portrait);
  float radius = max(length(galaxyPoint), 0.0001);
  float angle = atan(galaxyPoint.y, galaxyPoint.x);
  float spiralPhase =
    angle * 2.0 - log(radius + 0.055) * 4.9 + time * 0.14;
  float spiralWave = 0.5 + 0.5 * cos(spiralPhase);
  float armGlow = pow(spiralWave, 1.85);
  float armRidge = pow(spiralWave, 5.2);
  float outerEnvelope = 1.0 - smoothstep(0.58, 0.92, radius);
  float innerEnvelope = smoothstep(0.045, 0.13, radius);
  float diskEnvelope = exp(-radius * 2.0) *
    (1.0 - smoothstep(0.72, 0.98, radius));

  vec2 cloudUv = galaxyPoint * vec2(7.0, 9.0) +
    vec2(time * 0.032, -time * 0.021);
  float cloud = valueNoise(cloudUv);
  float clump = smoothstep(0.28, 0.78, cloud);
  float featherWave = 0.5 + 0.5 * cos(spiralPhase * 2.0 + 1.2);
  float featherArms = pow(featherWave, 8.0) * 0.18;
  float arms = (armGlow * 0.28 + armRidge * 0.78 + featherArms) *
    outerEnvelope * innerEnvelope;
  float darkLane = pow(
    0.5 + 0.5 * cos(spiralPhase + 0.4),
    14.0
  ) * outerEnvelope * innerEnvelope;
  float dust = max(
    0.0,
    arms * (0.32 + clump * 0.68) - darkLane * 0.25
  );
  float diskMist = diskEnvelope * (0.07 + clump * 0.24);
  float luminousCore = exp(-radius * 7.4);
  float nucleus = exp(-radius * radius * 130.0);
  float safe = fusionTextSafeMask(uv, 0.9);

  galaxyStarMask = saturate(
    (
      dust * 1.28 +
      armGlow * outerEnvelope * innerEnvelope * 0.15 +
      diskMist * 0.3 +
      luminousCore * 0.34
    ) * safe
  );
  galaxyEnergy = saturate(
    (
      arms * 0.85 +
      diskMist * 0.3 +
      luminousCore * 0.5 +
      nucleus * 0.75
    ) * safe
  );
  vec3 nebulaColor = mix(
    fusionPalette(0.12),
    fusionPalette(0.55),
    clump
  );
  return (
    nebulaColor * (dust * 0.58 + diskMist * 0.13) +
    vec3(0.48, 0.82, 0.72) * armRidge * outerEnvelope *
      innerEnvelope * 0.095 +
    vec3(0.018, 0.1, 0.13) * luminousCore * 0.11 +
    vec3(0.94, 0.72, 0.36) * nucleus * 0.22
  ) * safe;
}

vec3 fusionNebulaSky(vec2 uv, float time, out float nebulaEnergy) {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  float portrait = 1.0 - smoothstep(0.82, 1.12, aspect);
  vec2 driftUv = uv + vec2(time * 0.003, -time * 0.0019);
  driftUv += u_pointer * mix(vec2(0.004, 0.0025), vec2(0.0015), portrait);

  vec2 cloudPoint = rotate2d(-0.34) * (driftUv - 0.5);
  float cloudA = valueNoise(
    cloudPoint * vec2(3.4, 5.2) + vec2(time * 0.014, -time * 0.009)
  );
  float cloudB = cloudA;
  if (u_steps > 23.5) {
    cloudB = valueNoise(
      rotate2d(0.93) * cloudPoint * vec2(7.6, 9.2) +
        vec2(-time * 0.009, time * 0.013) + 17.0
    );
  }
  float cloud = smoothstep(0.32, 0.78, cloudA * 0.66 + cloudB * 0.34);

  float lowerRibbonY = mix(0.73, 0.79, portrait) +
    0.105 * sin(driftUv.x * 4.6 + time * 0.11) +
    0.038 * sin(driftUv.x * 10.2 - time * 0.17);
  float upperRibbonY = mix(0.17, 0.56, portrait) +
    0.075 * sin(driftUv.x * 5.8 - time * 0.14 + 2.4);
  float middleRibbonY = mix(0.46, 0.6, portrait) +
    0.065 * sin(driftUv.x * 7.2 - time * 0.13 + 1.1);
  float lowerRibbon = exp(-abs(driftUv.y - lowerRibbonY) * 8.2);
  float upperRibbon = exp(-abs(driftUv.y - upperRibbonY) * 11.0);
  float middleRibbon = exp(-abs(driftUv.y - middleRibbonY) * 13.0) *
    smoothstep(0.42, 0.72, uv.x);

  vec2 rightDelta = (uv - vec2(0.79, 0.37)) / vec2(0.64, 0.58);
  vec2 lowerDelta = (uv - vec2(0.48, 0.9)) / vec2(0.72, 0.32);
  float rightEnvelope = exp(-dot(rightDelta, rightDelta) * 1.1);
  float lowerEnvelope = exp(-dot(lowerDelta, lowerDelta) * 1.25);
  float envelope = saturate(0.2 + rightEnvelope * 0.84 + lowerEnvelope * 0.58);
  float field = (
    cloud * 0.5 +
    lowerRibbon * (0.52 + cloud * 0.32) +
    upperRibbon * (0.24 + cloudB * 0.2) +
    middleRibbon * (0.24 + cloudA * 0.38)
  ) * envelope;
  float voidPocket =
    smoothstep(0.58, 0.82, 1.0 - cloudA) * cloudB;
  field *= mix(1.0, 0.68, voidPocket);
  float mysticBreath = mix(
    1.0,
    0.94 + 0.06 * sin(time * 0.085 + cloudA * 2.4),
    u_motion
  );
  field *= mysticBreath;
  float shimmer = pow(
    0.5 + 0.5 * sin(driftUv.x * 13.0 - time * 0.75 + cloudB * 5.0),
    18.0
  ) * lowerRibbon;
  float safe = fusionTextSafeMask(uv, 0.82);
  field *= safe;
  shimmer *= safe;

  vec3 cloudColor = mix(
    fusionPalette(0.2),
    fusionPalette(0.62),
    cloudB
  );
  nebulaEnergy = saturate(field * 0.42 + shimmer * 0.3);
  return (
    cloudColor * field * 0.31 +
    vec3(0.48, 0.82, 0.72) * shimmer * 0.21 +
    vec3(0.94, 0.72, 0.36) * upperRibbon * cloud * safe * 0.095 +
    vec3(0.08, 0.6, 0.52) * middleRibbon * cloudB * safe * 0.1
  );
}

vec3 fusionDistantGalaxy(
  vec2 uv,
  vec2 center,
  vec2 scale,
  float rotation,
  float time,
  float armCount,
  float spinSpeed,
  float phase,
  float intensity,
  out float distantEnergy
) {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 local = (
    uv + u_pointer * vec2(-0.0012, -0.0008) - center
  ) * vec2(aspect, 1.0);
  local = rotate2d(rotation) * local / scale;
  float radius = max(length(local), 0.0001);
  float angle = atan(local.y, local.x);
  float spiralPhase =
    angle * armCount - log(radius + 0.07) * 4.1 +
      time * spinSpeed + phase;
  float spiral = 0.5 + 0.5 * cos(spiralPhase);
  float arms = pow(spiral, 5.6);
  float feather = pow(
    0.5 + 0.5 * cos(spiralPhase * 2.0 + 1.7),
    12.0
  );
  float envelope = (1.0 - smoothstep(0.46, 1.08, radius)) *
    smoothstep(0.03, 0.13, radius);
  float core = exp(-radius * 5.2);
  float nucleus = exp(-radius * radius * 92.0);
  float dustLane = pow(
    0.5 + 0.5 * cos(spiralPhase + 0.48),
    18.0
  ) * envelope;
  float structure = max(
    0.0,
    (arms * 0.78 + spiral * 0.14 + feather * 0.18) * envelope -
      dustLane * 0.28
  );
  float knots = pow(
    max(0.0, sin(angle * 13.0 - radius * 39.0 - time * 0.9 + phase * 2.0)),
    26.0
  ) * structure;
  float safe = fusionTextSafeMask(uv, 0.86);
  distantEnergy = saturate(
    (structure * 0.7 + core * 0.38 + nucleus * 0.72) * safe * intensity
  );
  vec3 armColor = mix(
    fusionPalette(fract(phase / TAU + 0.18)),
    fusionPalette(fract(phase / TAU + 0.66)),
    spiral
  );
  return (
    armColor * structure * 0.43 +
    vec3(0.48, 0.82, 0.72) * core * 0.14 +
    vec3(0.96, 0.74, 0.38) * nucleus * 0.5 +
    vec3(0.7, 0.9, 0.76) * knots * 0.34
  ) * safe * intensity;
}

vec3 fusionShootingStar(
  vec2 uv,
  float time,
  float phase,
  float period,
  float duration,
  float lane,
  float slope,
  out float shootingEnergy
) {
  float localTime = mod(time + phase * period, period);
  shootingEnergy = 0.0;
  if (localTime > duration || u_motion < 0.001) {
    return vec3(0.0);
  }
  float travel = saturate(localTime / duration);
  float visibility = smoothstep(0.0, 0.045, localTime) *
    (1.0 - smoothstep(duration * 0.78, duration, localTime)) * u_motion;
  vec2 motionDirection = normalize(vec2(-1.0, slope));
  vec2 tailDirection = -motionDirection;
  vec2 perpendicular = vec2(-tailDirection.y, tailDirection.x);
  vec2 head = mix(
    vec2(1.16, lane - 0.08),
    vec2(-0.16, lane + 0.4),
    travel
  );
  vec2 delta = uv - head;
  float along = dot(delta, tailDirection);
  float across = abs(dot(delta, perpendicular));
  float tailEnvelope = smoothstep(0.0, 0.025, along) *
    (1.0 - smoothstep(0.24, 0.52, along));
  float tailCore = exp(-across * 430.0) * tailEnvelope;
  float tailGlow = exp(-across * 105.0) * tailEnvelope;
  float headCore = exp(-dot(delta, delta) * 18000.0);
  float headGlow = exp(-dot(delta, delta) * 1050.0);
  float trailDust = pow(
    max(0.0, sin(along * 155.0 - time * 18.0 + phase * TAU)),
    18.0
  ) * tailGlow * step(0.02, along);
  float sparkle = 0.72 + 0.28 * sin(time * 7.4 + phase * TAU);
  float safe = fusionTextSafeMask(uv, 0.92);
  float star = (tailCore * 0.72 + tailGlow * 0.18 + headGlow * 0.5 +
    headCore * 1.2 + trailDust * 0.24) * visibility * sparkle * safe;
  shootingEnergy = saturate(star);
  return (
    vec3(0.5, 0.86, 0.78) *
      (tailCore * 0.72 + headGlow * 0.78 + trailDust * 0.3) +
    vec3(0.98, 0.76, 0.4) * (tailGlow * 0.24 + headCore * 1.55)
  ) * visibility * sparkle * safe;
}

vec3 fusionPlanet(
  vec2 point,
  vec2 center,
  float radius,
  float lightAngle,
  float paletteOffset,
  float bandFrequency,
  float phase,
  float ringStrength,
  float intensity,
  float time,
  out float planetDisc
) {
  vec2 local = (point - center) / max(radius, 0.0001);
  float radial = length(local);
  float edgeWidth = clamp(
    1.25 / (max(1.0, u_resolution.y) * max(radius, 0.001)),
    0.014,
    0.14
  );
  float disc = 1.0 - smoothstep(
    1.0 - edgeWidth,
    1.0 + edgeWidth,
    radial
  );
  float sphereZ = sqrt(max(0.0, 1.0 - radial * radial));
  float driftingLight = lightAngle + 0.055 * sin(time * 0.075 + phase);
  vec2 planarLight = vec2(cos(driftingLight), sin(driftingLight));
  float lightAmount = saturate(
    dot(local, planarLight) * 0.58 + sphereZ * 0.64
  );
  float crescent = pow(lightAmount, 2.4) * disc;
  float bands = 0.5 + 0.5 * sin(
    local.y * bandFrequency +
    local.x * 1.8 +
    time * 0.11 +
    phase
  );
  float atmosphere = (
    1.0 - smoothstep(0.94, 1.2, radial)
  ) * smoothstep(0.7, 1.0, radial);
  vec2 radialDirection = local / max(radial, 0.001);
  float lightFacing = saturate(
    0.5 + 0.5 * dot(radialDirection, planarLight)
  );
  atmosphere *= pow(lightFacing, 2.0);

  vec2 ringPoint = rotate2d(-0.42 + phase * 0.11) * (point - center);
  ringPoint.y *= 4.2;
  float ringDistance = abs(length(ringPoint) - radius * 1.48);
  float ring = (
    1.0 - smoothstep(radius * 0.035, radius * 0.13, ringDistance)
  ) * ringStrength;
  float ringFront = step(0.0, ringPoint.y);
  ring *= mix(0.28, 1.0, ringFront);
  ring *= mix(1.0 - disc * 0.75, 1.0, ringFront);

  float surface = disc * (
    0.012 + crescent * (0.16 + bands * 0.055)
  );
  float specular = pow(lightAmount, 12.0) * disc * 0.025;
  vec3 dayColor = fusionPalette(paletteOffset);
  vec3 atmosphereColor = mix(
    vec3(0.48, 0.82, 0.72),
    fusionPalette(paletteOffset + 0.24),
    0.34
  );

  planetDisc = disc;
  return (
    dayColor * surface +
    atmosphereColor * (atmosphere * 0.075 + ring * 0.07) +
    vec3(0.8, 0.93, 0.84) * specular
  ) * intensity;
}

vec3 fusionProtocol(vec2 uv, vec2 point, float time, out float energy) {
  // Small planetary silhouettes create a distant orbital arc around the galaxy.
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  float portrait = 1.0 - smoothstep(0.82, 1.12, aspect);
  vec2 galaxyUvCenter = fusionGalaxyUvCenter(portrait);
  float driftScale = mix(1.0, 0.62, portrait);
  vec2 planetCenterA =
    (mix(vec2(0.67, 0.18), vec2(0.88, 0.16), portrait) - 0.5) *
      vec2(aspect, 1.0) +
    vec2(cos(time * 0.065 + 0.7), sin(time * 0.058 + 0.7)) *
      0.009 * driftScale;
  vec2 planetCenterB =
    (mix(vec2(0.86, 0.29), vec2(0.91, 0.49), portrait) - 0.5) *
      vec2(aspect, 1.0) +
    vec2(cos(time * 0.058 + 1.7), sin(time * 0.07 + 1.7)) *
      0.011 * driftScale;
  vec2 planetCenterC =
    (mix(vec2(0.94, 0.6), vec2(0.75, 0.86), portrait) - 0.5) *
      vec2(aspect, 1.0) +
    vec2(cos(time * 0.052 + 3.1), sin(time * 0.062 + 3.1)) *
      0.009 * driftScale;
  vec2 planetCenterD =
    (mix(vec2(0.73, 0.84), vec2(0.13, 0.74), portrait) - 0.5) *
      vec2(aspect, 1.0) +
    vec2(cos(time * 0.062 + 4.6), sin(time * 0.052 + 4.6)) *
      0.008 * driftScale;

  float planetFieldA = 0.0;
  float planetFieldB = 0.0;
  float planetFieldC = 0.0;
  float planetFieldD = 0.0;
  vec3 planetColor = vec3(0.0);
  if (u_steps > 27.5 && portrait < 0.55) {
    planetColor += fusionPlanet(
      point,
      planetCenterA,
      mix(0.042, 0.032, portrait),
      0.4,
      0.3,
      9.0,
      0.7,
      0.0,
      0.44,
      time,
      planetFieldA
    );
  }
  planetColor += fusionPlanet(
    point,
    planetCenterB,
    mix(0.058, 0.043, portrait),
    2.4,
    0.72,
    13.0,
    1.7,
    0.72,
    0.74,
    time,
    planetFieldB
  );
  planetColor += fusionPlanet(
    point,
    planetCenterC,
    mix(0.044, 0.05, portrait),
    -2.2,
    0.42,
    8.0,
    3.1,
    0.0,
    0.42,
    time,
    planetFieldC
  );
  if (u_steps > 23.5) {
    planetColor += fusionPlanet(
      point,
      planetCenterD,
      mix(0.066, 0.038, portrait),
      -0.65,
      0.88,
      15.0,
      4.6,
      0.12,
      0.6,
      time,
      planetFieldD
    );
  }
  float planetField = max(
    max(planetFieldA, planetFieldB),
    max(planetFieldC, planetFieldD)
  );
  float celestialSafe = fusionTextSafeMask(uv, 0.94);
  planetColor *= celestialSafe;
  planetField *= celestialSafe;

  vec2 galaxyCenterPoint = (galaxyUvCenter - 0.5) * vec2(aspect, 1.0);
  vec2 clusterDelta = (point - galaxyCenterPoint) /
    mix(vec2(0.72, 0.48), vec2(0.25, 0.42), portrait);
  float clusterAura = exp(-dot(clusterDelta, clusterDelta) * 1.35);

  float nebulaEnergy = 0.0;
  vec3 nebulaColor = fusionNebulaSky(uv, time, nebulaEnergy);
  float galaxyEnergy = 0.0;
  float galaxyStarMask = 0.0;
  vec3 galaxyColor = fusionGalaxy(
    uv,
    time,
    galaxyEnergy,
    galaxyStarMask
  );
  float distantEnergyA = 0.0;
  vec3 distantGalaxyA = fusionDistantGalaxy(
    uv,
    mix(vec2(0.17, 0.82), vec2(0.79, 0.82), portrait),
    mix(vec2(0.25, 0.095), vec2(0.15, 0.075), portrait),
    -0.58,
    time,
    2.0,
    0.14,
    3.2,
    mix(0.88, 0.7, portrait),
    distantEnergyA
  );
  float distantEnergyC = 0.0;
  vec3 distantGalaxyC = fusionDistantGalaxy(
    uv,
    mix(vec2(0.54, 0.13), vec2(0.82, 0.48), portrait),
    mix(vec2(0.19, 0.058), vec2(0.12, 0.052), portrait),
    -0.18,
    time,
    4.0,
    0.125,
    1.35,
    mix(0.68, 0.56, portrait),
    distantEnergyC
  );

  float shootingEnergyA = 0.0;
  vec3 shootingStars = fusionShootingStar(
    uv,
    time,
    0.17,
    7.2,
    0.78,
    mix(0.14, 0.2, portrait),
    0.36,
    shootingEnergyA
  );
  float shootingEnergyB = 0.0;
  if (u_steps > 27.5) {
    shootingStars += fusionShootingStar(
      uv,
      time,
      0.63,
      10.5,
      0.9,
      mix(0.42, 0.5, portrait),
      0.24,
      shootingEnergyB
    );
  }

  float particleMask = saturate(
    0.68 +
    galaxyStarMask * 0.62 +
    galaxyEnergy * 0.22 +
    distantEnergyA * 0.26 +
    distantEnergyC * 0.2 +
    nebulaEnergy * 0.14 +
    clusterAura * 0.08
  );
  particleMask *= mix(0.92, 1.0, smoothstep(0.1, 0.72, uv.x));
  particleMask *= fusionTextSafeMask(uv, 0.74);
  float microEnergy = 0.0;
  vec3 microColor = fusionMicroParticles(
    uv,
    time,
    particleMask,
    microEnergy
  );
  float sparkleEnergy = 0.0;
  vec3 sparkleColor = fusionMagicSparkles(
    uv,
    time,
    particleMask,
    sparkleEnergy
  );
  microColor *= 1.0 - planetField * mix(0.88, 0.94, portrait);
  sparkleColor *= 1.0 - planetField * 0.76;
  galaxyColor *= 1.0 - planetField * 0.35;

  float floorMask = smoothstep(0.58, 0.98, uv.y);
  float floorStreak = pow(
    max(0.0, sin(uv.x * 94.0 + sin(uv.y * 18.0) * 3.0 - time * 0.7)),
    32.0
  ) * floorMask;
  float nebulaShadow = mix(1.0, 0.76, u_dark);

  vec3 color =
    nebulaColor * mix(1.12, 0.98, portrait) * nebulaShadow +
    distantGalaxyA +
    distantGalaxyC +
    galaxyColor * mix(1.48, 1.28, portrait) +
    planetColor * mix(0.74, 0.58, portrait) +
    microColor * mix(1.15, 1.02, portrait) +
    sparkleColor * mix(0.82, 0.72, portrait) +
    shootingStars * 0.95 +
    vec3(0.02, 0.1, 0.085) * floorStreak *
      mix(0.008, 0.0, portrait);
  energy = saturate(
    nebulaEnergy * 0.32 +
    galaxyEnergy * 0.6 +
    distantEnergyA * 0.28 +
    distantEnergyC * 0.22 +
    microEnergy * 0.5 +
    sparkleEnergy * 0.38 +
    shootingEnergyA * 0.54 +
    shootingEnergyB * 0.48 +
    planetField * 0.22
  );
  return color;
}

vec3 abyssalGlassHalo(vec2 uv, vec2 point, float time, out float energy) {
  vec2 haloPoint = rotate2d(-0.07 + u_pointer.x * 0.012) *
    (point - vec2(0.38 + u_pointer.x * 0.025, 0.19));
  vec2 ellipse = haloPoint * vec2(0.84, 1.02);
  float radius = length(ellipse);
  float angle = atan(ellipse.y, ellipse.x);
  float haloRadius = 0.77 + 0.006 * sin(angle * 3.0 - time * 0.08);
  float signedDistance = radius - haloRadius;
  float distanceToRim = abs(signedDistance);

  float rim = exp(-distanceToRim * 155.0);
  float bloom = exp(-distanceToRim * 15.0);
  float innerRefraction = exp(-abs(signedDistance + 0.018) * 92.0);
  float inside = 1.0 - smoothstep(-0.13, 0.08, signedDistance);
  float keyLight = 0.28 + 0.72 * pow(
    saturate(0.5 + 0.5 * cos(angle + 1.8)),
    1.7
  );
  float shimmer = 0.86 + 0.14 * sin(angle * 7.0 - time * 0.19);

  vec3 tint = spectrum(angle / TAU + 0.72 + time * 0.003);
  vec3 color = tint * keyLight * shimmer * (
    rim * 0.78 + bloom * 0.105 + innerRefraction * 0.16
  );
  color += vec3(0.025, 0.16, 0.27) * bloom * inside * 0.13;

  float depthArc = exp(-abs(radius - haloRadius - 0.085) * 96.0) *
    pow(saturate(0.5 + 0.5 * cos(angle + 2.2)), 3.0);
  color += vec3(0.12, 0.34, 0.58) * depthArc * 0.08;

  float stars = sparseStars(uv, time * 0.36, 0.995);
  color += vec3(0.34, 0.69, 1.0) * stars * 0.18;
  color *= textSafeMask(uv, 0.87);

  energy = saturate(rim * 0.65 + bloom * 0.28 + depthArc * 0.12 + stars * 0.12);
  return color;
}

vec3 nocturneVeilMinimal(vec2 uv, vec2 point, float time, out float energy) {
  vec2 veilPoint = rotate2d(0.19 + u_pointer.x * 0.012) *
    (point - vec2(0.05, 0.075 + u_pointer.y * 0.012));
  float curve =
    0.105 * sin(veilPoint.x * 1.65 + time * 0.075) +
    0.032 * sin(veilPoint.x * 4.3 - time * 0.055);

  float cyanDistance = abs(veilPoint.y - curve + 0.23);
  float blueDistance = abs(veilPoint.y - curve + 0.035);
  float violetDistance = abs(veilPoint.y - curve - 0.17);
  vec2 normalizedPoint = veilPoint / vec2(1.28, 0.67);
  float envelope = exp(-dot(normalizedPoint, normalizedPoint) * 0.82);

  float cyanSheet =
    exp(-cyanDistance * 7.5) * 0.18 +
    exp(-cyanDistance * 61.0) * 0.33;
  float blueSheet =
    exp(-blueDistance * 8.5) * 0.21 +
    exp(-blueDistance * 72.0) * 0.38;
  float violetSheet =
    exp(-violetDistance * 7.0) * 0.16 +
    exp(-violetDistance * 58.0) * 0.29;
  float silk = pow(
    0.5 + 0.5 * cos(blueDistance * 118.0 + veilPoint.x * 8.0 - time * 0.38),
    18.0
  ) * exp(-blueDistance * 11.0);

  vec3 color =
    vec3(0.03, 0.54, 0.76) * cyanSheet +
    vec3(0.13, 0.34, 0.82) * blueSheet +
    vec3(0.42, 0.32, 0.85) * violetSheet +
    vec3(0.56, 0.86, 1.0) * silk * 0.19;
  color *= envelope;

  float stars = sparseStars(uv, time * 0.28, 0.997);
  color += vec3(0.28, 0.52, 1.0) * stars * 0.1;
  color *= textSafeMask(uv, 0.83);

  energy = saturate(
    (cyanSheet + blueSheet + violetSheet) * envelope * 0.48 +
    silk * 0.15
  );
  return color;
}

vec3 silentSingularity(vec2 uv, vec2 point, float time, out float energy) {
  vec2 center = vec2(
    0.37 + u_pointer.x * 0.026,
    -0.105 - u_pointer.y * 0.018
  );
  vec2 singularityPoint = rotate2d(-0.035) * (point - center);
  vec2 ellipse = singularityPoint * vec2(0.91, 1.04);
  float radius = length(ellipse);
  float angle = atan(ellipse.y, ellipse.x);
  float singularityRadius = 0.49 +
    0.0045 * sin(angle * 5.0 - time * 0.07);
  float ringDistance = abs(radius - singularityRadius);

  float rim = exp(-ringDistance * 175.0);
  float bloom = exp(-ringDistance * 17.0);
  float echo = exp(-abs(radius - singularityRadius - 0.032) * 92.0);
  float topKey = 0.22 + 0.78 * pow(
    saturate(0.5 + 0.5 * cos(angle + 1.42)),
    2.1
  );

  vec2 tailPoint = rotate2d(0.16) * (point - center);
  float tailCurve = 0.058 * sin(tailPoint.x * 2.1 - time * 0.06);
  float tailDistance = abs(tailPoint.y - tailCurve);
  float tailGate =
    (1.0 - smoothstep(-0.72, 0.1, tailPoint.x)) *
    (1.0 - smoothstep(0.88, 1.28, abs(tailPoint.x)));
  float tail = (
    exp(-tailDistance * 25.0) * 0.14 +
    exp(-tailDistance * 104.0) * 0.38
  ) * tailGate;

  float disk = 1.0 - smoothstep(
    singularityRadius - 0.018,
    singularityRadius + 0.012,
    radius
  );
  vec3 ringTint = spectrum(angle / TAU + 0.66 + time * 0.002);
  vec3 color = ringTint * (
    rim * 0.84 + bloom * 0.09 + echo * 0.12
  ) * topKey;
  color += vec3(0.37, 0.43, 0.83) * tail;
  color -= vec3(0.012, 0.018, 0.032) * disk * u_dark;

  float dust = sparseStars(uv, time * 0.2, 0.994) *
    exp(-ringDistance * 8.0);
  color += vec3(0.48, 0.57, 1.0) * dust * 0.22;
  color *= textSafeMask(uv, 0.9);

  energy = saturate(rim * 0.7 + bloom * 0.21 + tail * 0.25 + dust * 0.2);
  return color;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.y = 1.0 - uv.y;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 point = uv - 0.5;
  point.x *= aspect;

  float energy = 0.0;
  vec3 effect = fusionProtocol(uv, point, u_time, energy);

  float rightAura = exp(-dot(
    (uv - vec2(0.88, 0.35)) / vec2(0.42, 0.52),
    (uv - vec2(0.88, 0.35)) / vec2(0.42, 0.52)
  ));
  float lowerAura = exp(-dot(
    (uv - vec2(0.62, 0.9)) / vec2(0.48, 0.28),
    (uv - vec2(0.62, 0.9)) / vec2(0.48, 0.28)
  ));
  float vignette = 1.0 - smoothstep(0.38, 0.94, length((uv - 0.5) * vec2(0.72, 1.0)));

  float quietScene = 0.0;
  float fusionScene = 1.0;
  vec3 rightAuraColor = mix(
    vec3(0.0, 0.07, 0.1),
    vec3(0.003, 0.035, 0.04),
    fusionScene
  );
  vec3 lowerAuraColor = mix(
    vec3(0.06, 0.025, 0.1),
    vec3(0.035, 0.02, 0.006),
    fusionScene
  );
  vec3 darkBase = mix(
    vec3(0.006, 0.012, 0.022),
    vec3(0.001, 0.002, 0.004),
    fusionScene
  );
  darkBase += rightAuraColor * rightAura * mix(0.34, 0.12, quietScene);
  darkBase += lowerAuraColor * lowerAura * mix(0.2, 0.06, quietScene);
  darkBase *= 0.68 + vignette * 0.32;

  vec3 lightBase = mix(
    vec3(0.974, 0.982, 1.0),
    vec3(0.95, 0.963, 0.995),
    fusionScene
  );
  vec3 rightAuraShadow = mix(
    vec3(0.035, 0.012, 0.0),
    vec3(0.004, 0.028, 0.035),
    fusionScene
  );
  vec3 lowerAuraShadow = mix(
    vec3(0.008, 0.022, 0.045),
    vec3(0.035, 0.023, 0.006),
    fusionScene
  );
  lightBase -= rightAuraShadow * rightAura;
  lightBase -= lowerAuraShadow * lowerAura;

  vec3 darkColor = darkBase + effect;
  vec3 energyShadow = mix(
    vec3(0.025, 0.018, 0.0),
    vec3(0.038, 0.014, 0.006),
    fusionScene
  );
  vec3 lightColor = lightBase - energyShadow * energy + effect * 0.36;
  vec3 finalColor = mix(lightColor, darkColor, u_dark);

  float grainAmplitude = mix(
    mix(0.008, 0.014, u_dark),
    mix(0.004, 0.006, u_dark),
    fusionScene
  );
  float grain = (hash21(gl_FragCoord.xy + floor(u_time * 5.0)) - 0.5) *
    grainAmplitude;
  finalColor += grain;
  finalColor = finalColor / (1.0 + max(vec3(0.0), finalColor - 0.82) * 0.62);
  finalColor = pow(max(finalColor, vec3(0.0)), vec3(0.94));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("AI background shader failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("AI background program failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function AIBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [contextEpoch, setContextEpoch] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const host = root?.parentElement;
    const gl = canvas?.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });

    if (!root || !canvas || !host || !gl) {
      if (root) {
        root.dataset.fallback = "true";
        root.dataset.ready = "true";
      }
      return;
    }

    const program = createProgram(gl);
    if (!program) {
      root.dataset.fallback = "true";
      root.dataset.ready = "true";
      return;
    }

    const positionBuffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const motionLocation = gl.getUniformLocation(program, "u_motion");
    const darkLocation = gl.getUniformLocation(program, "u_dark");
    const stepsLocation = gl.getUniformLocation(program, "u_steps");

    if (!positionBuffer || positionLocation < 0) {
      root.dataset.fallback = "true";
      root.dataset.ready = "true";
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const lowPowerDevice = (navigator.hardwareConcurrency ?? 8) <= 4;

    let reducedMotion = reducedMotionQuery.matches;
    let coarsePointer = coarsePointerQuery.matches;
    let darkMode = document.documentElement.classList.contains("dark");
    let pageVisible = !document.hidden;
    let animationFrame = 0;
    let lastPaint = 0;
    let lastFrameTime = performance.now();
    let pointerX = 0;
    let pointerY = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let contextLost = false;

    const motionAllowed = () => !reducedMotion && pageVisible && !contextLost;

    const resize = () => {
      const bounds = root.getBoundingClientRect();
      const cssWidth = Math.max(1, Math.round(bounds.width));
      const cssHeight = Math.max(1, Math.round(bounds.height));
      const dprCap = coarsePointer ? 1.05 : lowPowerDevice ? 1.1 : 1.2;
      const scale = coarsePointer ? 0.66 : lowPowerDevice ? 0.72 : 0.82;
      const maximumWidth = coarsePointer ? 900 : lowPowerDevice ? 1280 : 1600;
      const desiredWidth = cssWidth * Math.min(window.devicePixelRatio || 1, dprCap) * scale;
      const pixelWidth = Math.max(1, Math.min(maximumWidth, Math.round(desiredWidth)));
      const pixelHeight = Math.max(1, Math.round(pixelWidth * cssHeight / cssWidth));

      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      canvas.style.width = cssWidth + "px";
      canvas.style.height = cssHeight + "px";
      gl.viewport(0, 0, pixelWidth, pixelHeight);
    };

    const draw = (timestamp: number, still = false) => {
      if (contextLost) return;

      const deltaSeconds = Math.min(0.05, Math.max(0, (timestamp - lastFrameTime) / 1000));
      lastFrameTime = timestamp;
      const pointerEase = 1 - Math.exp(-deltaSeconds * 4.8);

      if (!still) {
        pointerX += (pointerTargetX - pointerX) * pointerEase;
        pointerY += (pointerTargetY - pointerY) * pointerEase;
      }

      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.uniform1f(timeLocation, still ? 7.25 : timestamp / 1000);
      gl.uniform1f(motionLocation, still ? 0 : 1);
      gl.uniform1f(darkLocation, darkMode ? 1 : 0);
      gl.uniform1f(
        stepsLocation,
        coarsePointer ? 22 : lowPowerDevice ? 26 : 28,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      root.dataset.ready = "true";
      root.dataset.fallback = "false";
    };

    const animate = (timestamp: number) => {
      animationFrame = 0;
      if (!motionAllowed()) return;

      const frameInterval = coarsePointer || lowPowerDevice
        ? 1000 / 30
        : 1000 / 60;
      if (timestamp - lastPaint >= frameInterval) {
        draw(timestamp);
        lastPaint = timestamp;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    const syncAnimation = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }

      root.dataset.paused = motionAllowed() ? "false" : "true";
      if (motionAllowed()) {
        lastPaint = 0;
        lastFrameTime = performance.now();
        animationFrame = requestAnimationFrame(animate);
      } else {
        draw(performance.now(), true);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (coarsePointer || reducedMotion) return;
      pointerTargetX = Math.max(
        -1,
        Math.min(1, (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1),
      );
      pointerTargetY = Math.max(
        -1,
        Math.min(1, (event.clientY / Math.max(1, window.innerHeight)) * 2 - 1),
      );
    };

    const onPointerLeave = () => {
      pointerTargetX = 0;
      pointerTargetY = 0;
    };

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      syncAnimation();
    };

    const onReducedMotionChange = () => {
      reducedMotion = reducedMotionQuery.matches;
      pointerTargetX = 0;
      pointerTargetY = 0;
      syncAnimation();
    };

    const onPointerModeChange = () => {
      coarsePointer = coarsePointerQuery.matches;
      pointerX = 0;
      pointerY = 0;
      pointerTargetX = 0;
      pointerTargetY = 0;
      resize();
      syncAnimation();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now(), !motionAllowed());
    });

    const themeObserver = new MutationObserver(() => {
      const nextDarkMode = document.documentElement.classList.contains("dark");
      if (nextDarkMode === darkMode) return;
      darkMode = nextDarkMode;
      if (!motionAllowed()) draw(performance.now(), true);
    });

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      root.dataset.fallback = "true";
      syncAnimation();
    };

    const onContextRestored = () => {
      setContextEpoch((epoch) => epoch + 1);
    };

    resize();
    draw(performance.now(), reducedMotion);
    resizeObserver.observe(root);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    coarsePointerQuery.addEventListener("change", onPointerModeChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    syncAnimation();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      coarsePointerQuery.removeEventListener("change", onPointerModeChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, [contextEpoch]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-ai-background={FUSION_PROTOCOL_SLUG}
      data-effect={FUSION_PROTOCOL_SLUG}
      data-paused="true"
      data-ready="false"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.copyWash} />
      <div className={styles.vignette} />
    </div>
  );
}
