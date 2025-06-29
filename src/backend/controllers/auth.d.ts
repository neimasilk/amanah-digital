import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
export declare const login: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
export declare const logout: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
export declare const getMe: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
export declare const forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
export declare const resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
export declare const updatePassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<any>;
//# sourceMappingURL=auth.d.ts.map