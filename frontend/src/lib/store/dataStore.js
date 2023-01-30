const baseUrl = ""
+ `http://${import.meta.env.VITE_APP_HOST}`
+ `:${import.meta.env.VITE_APP_PORT}`
+ `${import.meta.env.VITE_APP_BASE_URL}`;

export { baseUrl };