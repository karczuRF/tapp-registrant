export const tappletManifestSchema = {
  type: "object",
  properties: {
    packageName: {
      type: "string",
    },
    version: {
      type: "string",
    },
    displayName: {
      type: "string",
    },
    status: {
      type: "string",
    },
    category: {
      type: "string",
    },
    author: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        website: {
          type: "string",
        },
      },
      required: ["name", "website"],
    },
    about: {
      type: "object",
      properties: {
        summary: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
      required: ["summary", "description"],
    },
    audits: {
      type: "array",
      items: {
        type: "object",
        properties: {
          auditor: {
            type: "string",
          },
          reportUrl: {
            type: "string",
          },
        },
        required: ["auditor", "reportUrl"],
      },
    },
    design: {
      type: "object",
      properties: {
        logoPath: {
          type: "string",
        },
        backgroundPath: {
          type: "string",
        },
      },
      required: ["logoPath", "backgroundPath"],
    },
    repository: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["git"],
        },
        url: {
          type: "string",
        },
        codeowners: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["type", "url", "codeowners"],
    },
    source: {
      type: "object",
      properties: {
        location: {
          type: "object",
          properties: {
            npm: {
              type: "object",
              properties: {
                packageName: {
                  type: "string",
                },
                registry: {
                  type: "string",
                },
                distTarball: {
                  type: "string",
                },
                integrity: {
                  type: "string",
                },
              },
              required: ["packageName", "registry", "distTarball", "integrity"],
            },
          },
          required: ["npm"],
        },
      },
      required: ["location"],
    },
    supportedChain: {
      type: "array",
      items: {
        type: "string",
      },
    },
    permissions: {
      type: "array",
      items: {
        type: "string",
      },
    },
    manifestVersion: {
      type: "string",
    },
  },
  required: [
    "packageName",
    "version",
    "displayName",
    "status",
    "category",
    "author",
    "about",
    "audits",
    "design",
    "repository",
    "source",
    "supportedChain",
    "permissions",
    "manifestVersion",
  ],
}
