- `ro.logout` dispatch to `User.logout`

- remove `local` from `ro` -- let `User` model handle data, `ro` is just a controller

- each user has his/her own dir

- fix `getUserOrFail`

- `user-list` command

- be able to login multiple accounts -- user `$RO_DIR/users`

- special dir for `dev` for better dev experience

- `FileDownloadCommand`
- `FileUploadCommand`

- `ProjectDownloadCommand` -- show progress
- `ProjectUploadCommand` -- show progress
