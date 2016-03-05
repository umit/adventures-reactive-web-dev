module Library.Feature
  ( createFeature
  , Config
  , Feature
  ) where

import Effects exposing ( Never )
import Html exposing ( Html )
import Maybe exposing ( withDefault )
import Task exposing ( Task , andThen )

import Library.IO exposing ( MbTask )


type alias Config a m =
  { signal : Signal a
  , address : Signal.Address a
  , initialModel : ( m , MbTask a )
  , update : ( a -> m -> ( m , MbTask a ) )
  , view : ( Signal.Address a -> m -> Html )
  }

type alias Feature =
  { viewSignal: Signal Html
  , taskRunner: Signal ( Task Never () )
  }

createFeature : Config a m -> Feature
createFeature config =
  let
    -- update : Action -> ( Model , MbTask Action ) -> ( Model , MbTask Action )
    update action pair =
      config.update action (fst pair)

    -- modelAndMbTask : Signal  (Model , MbTask Action )
    modelAndMbTask =
      Signal.foldp update config.initialModel config.signal

    -- model : Signal Model
    model =
      Signal.map fst modelAndMbTask

    -- runTaskAndSendAction : Task Never Action -> Task Never ()
    runTaskAndSendAction task =
      task `andThen` Signal.send config.address

    -- runTask : ( Model, MbTask Action ) -> Task Never ()
    runTask (_, mbTask) =
      withDefault ( Task.succeed () ) ( Maybe.map runTaskAndSendAction mbTask )

    -- taskRunner : Signal ( Task Never () )
    taskRunner =
      Signal.map runTask modelAndMbTask

  in
    { viewSignal = Signal.map ( config.view config.address ) model
    , taskRunner = taskRunner
    }
