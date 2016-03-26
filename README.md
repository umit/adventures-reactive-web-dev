# adventures-reactive-web-dev

Adventures in Reactive Web Development.

Exploring various libraries, frameworks, and techniques for reactive web development, including:

- [Angular 2](http://angular.io)
- [Cycle.js](http://cycle.js.org)
- [Elm](http://elm-lang.org)
- [React](https://facebook.github.io/react/)
  - with [Redux](http://redux.js.org/)
  - with [RxJS](https://github.com/Reactive-Extensions/RxJS)
- [Yolk](https://github.com/garbles/yolk)

Also part of the adventure:

- [snabbdom](https://github.com/paldepind/snabbdom)
- [most](https://github.com/cujojs/most) and [most-subject](https://github.com/TylorS/most-subject)

## Requirements

You need to have [Node.js](https://nodejs.org) installed to run the examples.

There are several ways to install Node.js, including Homebrew and [nvm](https://github.com/creationix/nvm).

## One-time setup

You only need to run this command once:

```
npm i -g bower
```

This installs [Bower](http://bower.io/). It is used to install the client-side CSS used in the examples - namely, [Bootstrap](http://getbootstrap.com/). Technically, it's not required to run the examples, but it does make them look nicer.

The same server is used for every example. You only need to run this once:

```
# from the top-level directory
npm i
bower i
```

## One-time setup per example

For each example that you wish to run, you also need to run these commands once:

```
# from the top-level directory
cd client-<example> # replace with directory of the example you want to run
npm i
```

## Running the example

To run an example, open two terminal windows.

In the first terminal window:

```
# from the top-level directory
npm start
```

In the second terminal window:

```
# from the top-level directory
cd client-<example> # replace with directory of the example you want to run
npm run dev
```

## Viewing the example and making changes

Open http://localhost:3013 to view the example.

You can experiment with making changes by editing the code under the `client-<example>` directory. You only have to save the file to see your changes. Recompilation and browser page reload happen automatically.

## Branches

The `master` branch contains the most up-to-date code. However, you may be interested in other branches.

Simply run `git checkout <branchname>` to check out a branch, replacing `<branchname>` with one of the following:

- `ng2-webpack` : Angular 2 example using RxJS instead of Redux
- `ng2-systemjs` : Angular 2 example using SystemJS instead of Webpack
- `react-router` : React example using React-Router
- client-elm branches : there are 4 branches for the
[4-part article](https://github.com/foxdonut/adventures-reactive-web-dev/tree/master/client-elm#composing-features-and-behaviours-in-the-elm-architecture)
about the Elm example.

Finally, please note that the examples use Webpack. I left the `ng2-systemjs` branch there for reference, but I had a lot of trouble using SystemJS and I did not like having to add a bunch of `<script>` tags. I prefer the Webpack setup, which includes automatic recompilation and page refresh, so once I had that set up and working, I went with it for the rest of the examples.

