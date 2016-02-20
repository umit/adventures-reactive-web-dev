module TodoList.Feature (
  model,
  taskRunner,
  todoListFeature
  ) where

import Effects exposing (Never)
import Html exposing (Html)
import Http
import Maybe exposing (withDefault)
import Task exposing (Task, andThen)

import TodoList.View exposing (view)
import TodoList.Model exposing (Model)
import TodoList.Update exposing (Action, MbTask, actions, initialModel, update)


update' : Action -> (Model, MbTask) -> (Model, MbTask)
update' action pair =
  update action (fst pair)

-- initialModel = ({todos=[], message="Initializing..."}, Nothing)
-- actions = Signal.mailbox Waiting
-- update action _ = case action of Waiting -> ({todos=[], message="Waiting..."}, Nothing)
model' : Signal (Model, MbTask)
model' =
  Signal.foldp update' initialModel actions.signal


model : Signal Model
model =
  Signal.map fst model'


todoListFeature : Signal Html
todoListFeature =
  Signal.map (view actions.address) model


runTaskAndSendAction : Task Never Action -> Task Never ()
runTaskAndSendAction task =
  task `andThen` Signal.send actions.address


runTask : (Model, MbTask) -> Task Never ()
runTask (_, mbTask) =
  withDefault (Task.succeed ()) (Maybe.map runTaskAndSendAction mbTask)


taskRunner : Signal (Task Never ())
taskRunner =
  Signal.map runTask model'
