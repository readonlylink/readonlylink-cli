export class Config {
  isDev = process.env.NODE_ENV === "dev"
  base_url = this.isDev
    ? "http://localhost:8000/api"
    : "https://readonly.link/api"
}
