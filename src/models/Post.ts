export class Posts {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private id: string,
    // eslint-disable-next-line no-unused-vars
    private content: string,
    // eslint-disable-next-line no-unused-vars
    private update_at: string,
    // eslint-disable-next-line no-unused-vars
    private user_id: string
  ) {}

  public getId(): string {
    return this.id;
  }
  public getContent(): string {
    return this.content;
  }

  public getUserId(): string {
    return this.user_id;
  }
  public getUpdatAt(): string {
    return this.update_at;
  }
}

export interface post {
  id: string;
  content: string;
  user_id: string;
}
