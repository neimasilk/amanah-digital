interface EmailOptions {
    email: string;
    subject: string;
    message: string;
    html?: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export declare const emailTemplates: {
    welcome: (firstName: string) => {
        subject: string;
        html: string;
    };
    passwordReset: (resetUrl: string, firstName: string) => {
        subject: string;
        html: string;
    };
};
export {};
//# sourceMappingURL=email.d.ts.map