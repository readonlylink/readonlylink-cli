- remove `local` from `ro` -- let `User` model handle data, `ro` is just a controller

- each user has his/her own dir

- fix `getOrFail`

- `user-list` command

- be able to login multiple accounts -- user `$RO_DIR/users`

- special dir for `dev` for better dev experience

- restore `isLoggedIn` check

- `FileDownloadCommand`
- `FileUploadCommand`

- `ProjectDownloadCommand` -- show progress
- `ProjectUploadCommand` -- show progress
