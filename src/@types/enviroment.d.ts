declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            // JWT Secret
            SECRET: string;
            // PostgreSQL Crypt Secret
            PASSWDCRYPT: string;
        };
    };
};

export { };