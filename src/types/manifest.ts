interface Author {
  name: string;
  website: string;
}

interface About {
  summary: string;
  description: string;
}

interface Design {
  logoPath: string;
  backgroundPath: string;
}

interface Repository {
  type: string;
  url: string;
  codeowners: string[];
}

interface SourceLocation {
  npm: {
    packageName: string;
    registry: string;
    distTarball: string;
    integrity: string;
  };
}

interface Source {
  location: SourceLocation;
}

export interface Manifest {
  packageName: string;
  version: string;
  displayName: string;
  status: string;
  category: string;
  author: Author;
  about: About;
  design: Design;
  repository: Repository;
  source: Source;
  manifestVersion: string;
}
