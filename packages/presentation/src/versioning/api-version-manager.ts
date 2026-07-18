/**
 * API Version Manager.
 *
 * Provides version resolution and version-prefixed routing helpers.
 */

import type { Request } from 'express';

export class ApiVersionManager {
  public static readonly DEFAULT_VERSION = 'v1';
  public static readonly SUPPORTED_VERSIONS = ['v1'];

  public static resolveVersion(req: Request): string {
    const url = req.originalUrl || req.url;
    const match = /\/api\/(v\d+)/i.exec(url);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }

    const header = req.headers['x-api-version'];
    if (typeof header === 'string' && header.trim().length > 0) {
      const formatted = header.trim().toLowerCase();
      if (this.SUPPORTED_VERSIONS.includes(formatted)) {
        return formatted;
      }
    }

    return this.DEFAULT_VERSION;
  }

  public static formatPath(path: string, version = this.DEFAULT_VERSION): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/api/${version}${cleanPath}`;
  }
}
