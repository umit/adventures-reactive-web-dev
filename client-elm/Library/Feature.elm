module Library.Feature
  ( createFeature
  , Config
  , Feature
  ) where

import Effects exposing (Never)
import Html exposing (Html)
import Maybe exposing (withDefault)
import Task exposing (Task, andThen)

import Library.IO exposing (MbTask)


type alias Config a m =
  { actions: Signal.Mailbox a
  , initialModel: (m, MbTask a)
  , update: (a -> m -> (m, MbTask a))
  , view: (Signal.Address a -> m -> Html)
  }

type alias Feature a =
  { viewSignal: Signal Html
  , actions: Signal.Mailbox a
  , taskRunner: Signal (Task Never ())
  }

createFeature : Config a m -> Feature a
createFeature config =
  let
    -- update : Action -> (Model, MbTask Action) -> (Model, MbTask Action)
    update action pair =
      config.update action (fst pair)

    -- modelAndMbTask : Signal (Model, MbTask Action)
    modelAndMbTask =
      Signal.foldp update config.initialModel config.actions.signal

    -- model : Signal Model
    model =
      Signal.map fst modelAndMbTask

    -- runTaskAndSendAction : Task Never Action -> Task Never ()
    runTaskAndSendAction task =
      task `andThen` Signal.send config.actions.address

    -- runTask : (Model, MbTask Action) -> Task Never ()
    runTask (_, mbTask) =
      withDefault (Task.succeed ()) (Maybe.map runTaskAndSendAction mbTask)

    -- taskRunner : Signal (Task Never ())
    taskRunner =
      Signal.map runTask modelAndMbTask

  in
    { viewSignal = Signal.map (config.view config.actions.address) model
    , actions = config.actions
    , taskRunner = taskRunner
    }
