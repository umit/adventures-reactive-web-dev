module Library.Feature (createFeature, Config, Feature) where

import Effects exposing (Never)
import Html exposing (Html)
import Maybe exposing (withDefault)
import Signal exposing (Address, foldp, forwardTo, merge, mergeMany)
import Task exposing (Task, andThen)
import Library.IO exposing (MbTask)


type alias Config a m =
  { inputs : List (Signal a)
  , initialModel : ( m, MbTask a )
  , update : a -> m -> ( m, MbTask a )
  , view : Address a -> m -> Html
  }


type alias Feature =
  { viewSignal : Signal Html
  , taskRunner : Signal (Task Never ())
  }


createFeature : Config a m -> Feature
createFeature config =
  let
    -- actions : Signal.Mailbox (Maybe Action)
    actions =
      Signal.mailbox Nothing

    -- address : Address Action
    address =
      forwardTo actions.address Just

    -- update : Maybe Action -> ( Model , MbTask Action ) -> ( Model , MbTask Action )
    update maybeAction pair =
      case maybeAction of
        Nothing ->
          pair

        Just action ->
          config.update action (fst pair)

    -- signal : Signal ( Maybe Action )
    signal =
      merge actions.signal (mergeMany config.inputs |> Signal.map Just)

    -- modelAndMbTask : Signal (Model , MbTask Action )
    modelAndMbTask =
      foldp update config.initialModel signal

    -- model : Signal Model
    model =
      Signal.map fst modelAndMbTask

    -- runTaskAndSendAction : Task Never Action -> Task Never ()
    runTaskAndSendAction task =
      task `andThen` Signal.send address

    -- runTask : ( Model, MbTask Action ) -> Task Never ()
    runTask ( _, mbTask ) =
      withDefault (Task.succeed ()) (Maybe.map runTaskAndSendAction mbTask)

    -- taskRunner : Signal ( Task Never () )
    taskRunner =
      Signal.map runTask modelAndMbTask
  in
    { viewSignal = Signal.map (config.view address) model
    , taskRunner = taskRunner
    }
