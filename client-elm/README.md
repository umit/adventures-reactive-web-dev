# Composing Features

_Note: this is Part 4 of "Composing Features and Behaviours in the Elm Architecture". See the
[Introduction](https://github.com/foxdonut/adventures-reactive-web-dev/tree/master/client-elm#composing-features-and-behaviours-in-the-elm-architecture)
for an overview and the table of contents._

In
[Part 3](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-030-todosummary-feature/client-elm#multiple-listeners),
we combined three features together. We connected them to each other with signals and
addresses, and we used `map3` to combine their views into the main view.

As we add more features, our `TodoMain` module can grow larger than we'd like, and it might become
somewhat unwieldy to wire everything and combine all the views together.

Let's say we decide that the combination of `TodoList`, `TodoForm`, and `TodoSummary` forms a group
that we'd like to compose into a feature. Let's call this feature `TodoManager`. By doing this, the
smaller features can still be used individually, but we can also use the composition of the three
features as a whole, simply by using `TodoManager` without needing to know about the internal wiring
details.

Once we have created `TodoManager`, we'll see how we could use it on a page with an additional
feature, `TodoMinMax`, which displays the highest and lowest priority of the todo list. We'll
connect `TodoMinMax` to `TodoManager` so that `TodoMinMax` gets notified when the todo list is
updated, without `TodoMinMax` needing to know about the internal features within `TodoManager`.

> _The `TodoMinMax` feature is trivial. The feature itself is not what's important here. What we are
> exploring is how to compose smaller features into one, and then use that feature with another
> feature._

To illustrate, what we have at the end of
[Part 3](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-030-todosummary-feature/client-elm#multiple-listeners) is `TodoMain` with the three features:

<img src="images/todomain_1.png"/>

We'll move the three features to `TodoManager`, create `TodoMinMax`, and change `TodoMain` so that
on the page, `TodoMinMax` is on top of `TodoManager`:

<img src="images/todomain_2.png"/>

Let's start with `TodoManager`.

## TodoManager.Feature

What we want to do when grouping features into one is decide which outputs we want to make available
outside of the feature. In our case, we want to give access to `onUpdatedList`:

[TodoManager/Feature.elm](TodoManager/Feature.elm)
```elm
type alias Config =
  { outputs :
      { onUpdatedList : List (Signal.Address (List Todo))
      }
  }
```

Next, while our other features were `StartApp.App`s, this feature just passes on the `html` and
`tasks` from its inner features:

[TodoManager/Feature.elm](TodoManager/Feature.elm)
```elm
type alias TodoManagerFeature =
  { html : Signal Html
  , tasks : Signal (Task Never ())
  }
```

The rest of `TodoManager.Feature` looks a lot like `TodoMain` from our previous example. The main
difference is that we need to pass in the `config` that we receive from the outside:

[TodoManager/Feature.elm](TodoManager/Feature.elm)
```elm
makeTodoListFeature : Config -> TodoListFeature
makeTodoListFeature config =
  createTodoListFeature
    { inputs = [ todoListMailbox.signal ]
    , outputs =
        { onEditTodo = [ Signal.forwardTo todoFormMailbox.address Edit ]
        , onUpdatedList = Signal.forwardTo todoSummaryMailbox.address Update :: config.outputs.onUpdatedList
        }
    }


makeTodoFormFeature : Config -> TodoFormFeature
makeTodoFormFeature config =
  createTodoFormFeature
    { inputs = [ todoFormMailbox.signal ]
    , outputs =
        { onSaveTodo =
            List.append
              [ Signal.forwardTo todoListMailbox.address UpdateList
              , Signal.forwardTo todoSummaryMailbox.address LastSaved
              ]
              config.outputs.onSaveTodo
        }
    }
```

Notice how we combined `config.outputs.onUpdatedList` with the `onUpdatedList` that we had for the
inner features. In the `TodoList`, this was a single address, so we use `::` to append it to the
incoming list. For `TodoForm`, we already had a list of addresses, so we `append` them.

Next, we have our functions that prepare the `html` and `tasks`:

[TodoManager/Feature.elm](TodoManager/Feature.elm)
```elm
makeHtml : TodoListFeature -> TodoFormFeature -> TodoSummaryFeature -> Signal Html
makeHtml todoListFeature todoFormFeature todoSummaryFeature =
  Signal.map3 view todoListFeature.html todoFormFeature.html todoSummaryFeature.html


makeTasks : TodoListFeature -> TodoFormFeature -> TodoSummaryFeature -> Signal (Task Never ())
makeTasks todoListFeature todoFormFeature todoSummaryFeature =
  Signal.mergeMany
    [ todoListFeature.tasks
    , todoFormFeature.tasks
    , todoSummaryFeature.tasks
    ]
```

Our `view` function is the same as we had before, just separated out into its own module:

[TodoManager/View.elm](TodoManager/View.elm)
```elm
view : Html -> Html -> Html -> Html
view todoListView todoFormView todoSummaryView =
  div
    []
    [ todoFormView
    , todoListView
    , todoSummaryView
    ]

```

We're ready to write our top leve `createTodoManagerFeature` function:

[TodoManager/Feature.elm](TodoManager/Feature.elm)
```elm
createTodoManagerFeature : Config -> TodoManagerFeature
createTodoManagerFeature config =
  let
    todoListFeature =
      makeTodoListFeature config

    todoFormFeature =
      makeTodoFormFeature config

    todoSummaryFeature =
      makeTodoSummaryFeature config

    html =
      makeHtml todoListFeature todoFormFeature todoSummaryFeature

    tasks =
      makeTasks todoListFeature todoFormFeature todoSummaryFeature
  in
    { html = html
    , tasks = tasks
    }
```

We can call this function from `TodoMain` to create the `TodoManager` feature, pass in the
listeners, and get the `html` and `tasks` that we can use to pass down to `Main`.

## TodoMain

In `TodoMain`, we'll assemble `TodoManager` together with `TodoMinMax`:

[TodoMain.elm](TodoMain.elm)
```elm
todoMinMaxMailbox : Signal.Mailbox TodoMinMax.Action.Action
todoMinMaxMailbox =
  Signal.mailbox (Update [])


todoMinMaxFeature : TodoMinMaxFeature
todoMinMaxFeature =
  createTodoMinMaxFeature { inputs = [ todoMinMaxMailbox.signal ] }


todoManagerFeature : TodoManagerFeature
todoManagerFeature =
  createTodoManagerFeature
    { outputs =
        { onUpdatedList = [ Signal.forwardTo todoMinMaxMailbox.address Update ]
        , onSaveTodo = []
        }
    }

todoMainView : Html -> Html -> Html
todoMainView todoManagerView todoMinMaxView =
  div
    []
    [ todoMinMaxView
    , todoManagerView
    ]


html : Signal Html
html =
  Signal.map2 todoMainView todoManagerFeature.html todoMinMaxFeature.html


tasks : Signal (Task Never ())
tasks =
  todoManagerFeature.tasks


todoMainFeature =
  { html = html
  , tasks = tasks
  }
```

This should look familiar. We're using the same pattern as before, just that we "factored out" three
features into their own feature.

<img src="images/todo-example.png" width="400"/>

Fantastic! We now have a way of creating independent features, connecting them with signals and
addresses, and assembling small features into larger ones.

I hope you enjoyed this adventure. As mentioned in the introduction, feel free to post questions as
Github issues, and corrections or suggestions for improvement as Github pull requests.

Thanks for reading!

If you enjoyed this article, consider [tweeting](https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fgithub.com%2Ffoxdonut%2Fadventures-reactive-web-dev%2Ftree%2Fmaster%2Fclient-elm&text=Composing%20Features%20and%20Behaviours%20in%20the%20Elm%20Architecture&tw_p=tweetbutton&url=http%3A%2F%2Fgithub.com%2Ffoxdonut%2Fadventures-reactive-web-dev%2Ftree%2Fmaster%2Fclient-elm&via=foxdonut00) it to your followers.

Fred Daoud - foxdonut, @foxdonut00

