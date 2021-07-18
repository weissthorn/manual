## Manual

Documentation CMS for product / service
<br/>

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/cf9240677a0149859cfaaeedf0f8f996)](https://www.codacy.com/gh/weissthorn/manual/dashboard?utm_source=github.com&utm_medium=referral&utm_content=weissthorn/manual&utm_campaign=Badge_Grade) <a href= "https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"></a>

##### Demo

[Demo link](https://manual-five.vercel.app/)

<p>Admin:</p>
<p>email: admin@test.com</p>
<p>password: test123</p>

<p>Reader:</p>
<p>email: reader@test.com</p>
<p>password: test123</p>

![User](public/images/image0.png 'Users')
![Manual](public/images/image1.png 'Manual')
![Manual 2](public/images/image2.png 'Manual 2')
![Search](public/images/image3.png 'Search')

##### Prerequisite

- [NodeJS 10+](https://nodejs.dev/)
- [RethinkDB](https://rethinkdb.com/docs/install/)
- [Yarn](https://yarnpkg.com/getting-started/install)

##### Environment setup

See [.env.example file](/.env.example)

##### Install packages

```sh
yarn
```

##### Start app development

```sh
yarn dev
```

##### Start app

```sh
yarn start
```

##### Start app (staging)

```sh
yarn staging
```

##### Start app (production)

```sh
yarn production
```

##### Usage

1. Go to [http://your-domain.com/config](http://your-domain.com/config).
2. Go to [http://your-domain.com/setup](http://your-domain.com/setup) to setup default admin account.
3. Go to [http://your-domain.com/admin](http://your-domain.com/admin) to setup account for admin, editor or reader.
4. Go to [http://your-domain.com/manuals](http://your-domain.com/manuals) to create documentation for product or service.

##### Goals

- ~~User management (admin, editor and reader)~~
- ~~Manual, Section and Content~~
- ~~Searchable (section and content)~~
- ~~Intelligent content navigations~~
- ~~100% Responsiveness~~
- Document versioning
- Edit history
- AWS marketplace
- Digital Ocean app
- Docker image
- Vagrant box

##### Maintainer

[Olalekan Animashaun](https://github.com/kimolalekan)
