#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
BACKEND_DIR="${REPO_ROOT}/backend"
EXTERNAL_CONFIG_DIR="${SCRIPT_DIR}/configs"
LIB_DIR="${SCRIPT_DIR}/libs"
JAVA_HOME_LINK="${LIB_DIR}/java"

DEBUG="${DEBUG:-true}"
DEBUG_PORT="${DEBUG_PORT:-5005}"
DEBUG_SUSPEND="${DEBUG_SUSPEND:-n}"

echo "Running Spring Boot with external config..."
export SPRING_CONFIG_ADDITIONAL_LOCATION="optional:file:${EXTERNAL_CONFIG_DIR}/"

cd "${BACKEND_DIR}"

echo "Building JVM jar..."
./gradlew bootJar

JAR_PATH="build/libs/cinemax-0.0.1-SNAPSHOT.jar"

if [ ! -f "${JAR_PATH}" ]; then
  echo "Jar not found: ${JAR_PATH}"
  exit 1
fi

if [ "${DEBUG}" = "true" ]; then
  echo "Remote debug enabled on port ${DEBUG_PORT} (suspend=${DEBUG_SUSPEND})"
  exec java \
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=${DEBUG_SUSPEND},address=*:${DEBUG_PORT} \
    -jar "${JAR_PATH}"
fi

echo "Remote debug disabled"
exec java -jar "${JAR_PATH}"