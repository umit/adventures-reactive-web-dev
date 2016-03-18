# Composing Features and Behaviours in the Elm Architecture

by Fred Daoud - foxdonut, [@foxdonut00](https://twitter.com/foxdonut00)

## What is this article about?

First, some disclaimers: I only recently started learning Elm, and do not claim to be an expert.
Furthermore, I do not claim to have invented any of the ideas presented in this article. The purpose
is simply to put together what I feel are the best parts of what I have learned from
[The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/),
[Cycle.js](http://cycle.js.org/model-view-intent.html),
[RxJS](https://github.com/Reactive-Extensions/RxJS),
[Redux](http://redux.js.org/docs/introduction/ThreePrinciples.html), and others.

That being said, my goal is to explain an approach to organize Elm code into _features_, where each
feature is part of a page and is decoupled from other features, and to connect these features with
_behaviours_. Behaviours are "what happens next" during an Event -> Signal -> Update -> View
reaction. Specifically, we want to be able to

- Create features: each feature should be self-contained and independent of other features.
- Chain events: _after this happens, that should happen next_.
- Connect features with signals: _after this happens, notify all other features that want to be notified_,
without needing to "know" what those other features are. Features react to events: _do something
when **this** happens_, without needing to "know" which feature made **this** happen.

This will hopefully become clear when we dig into it and look at the code. What's important to know
before reading on is that I assume knowledge of The Elm Architecture, because I build on top of that
and will not go over the Elm Architecture itself. Please refer to
[The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/)
and [The Elm Tutorial](http://www.elm-tutorial.org/).

## Example Overview

I will use a simple Todo list application as an example. The application is on a single page, with a
list of todos and a form, allowing for creating, editing, and deleting todos. We'll add a summary at
the bottom which shows the total number of todos and the average priority. Finally, we'll add a
section at the top that shows the highest and lowest priority of the todo list.

<img src="images/todo-example.png" width="400"/>

The application is backed by a server that accepts requests, using JSON as the data exchange format.
The server is implemented with [Koa](http://koajs.com/). I won't go into the details of the server
implementation since it is not the focus of this article.

The article is divided into four parts, each in a separate branch:

- [Part 1: Creating a Feature](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-010-todolist-feature/client-elm)
- [Part 2: Connecting Features Together](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-020-todoform-feature/client-elm#adding-the-todoform-feature)
- [Part 3: Multiple Listeners](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-030-todosummary-feature/client-elm)
- [Part 4: Composing Features](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-040-todominmax-feature/client-elm)

The code in master is the same as in Part 4.

Questions as Github issues, and corrections or suggestions for improvement as Github pull requests, are welcome.

