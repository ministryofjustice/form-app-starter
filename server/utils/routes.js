module.exports = {
  getPathFor,
};

function getPathFor({ data, config }) {
  const { nextPath } = config;

  if (!nextPath.decisions) {
    return nextPath.path;
  }

  if (Array.isArray(nextPath.decisions)) {
    return determinePathFromDecisions({ decisions: nextPath.decisions, data });
  }

  return getPathFromAnswer({ nextPath: nextPath.decisions, data });
}

function getPathFromAnswer({ nextPath, data }) {
  const decidingValue = data[nextPath.discriminator];
  return nextPath[decidingValue];
}

function determinePathFromDecisions({ decisions, data }) {
  let path = null;
  for (const pathConfig of decisions) {
    const newPath = getPathFromAnswer({ nextPath: pathConfig, data });

    if (newPath) {
      path = newPath;
      break;
    }
  }

  return path;
}
