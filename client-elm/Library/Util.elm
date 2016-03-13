module Library.Util (broadcastAsEffect, broadcastAsTask) where

import Effects exposing (Effects)
import Task exposing (Task)


broadcastAsEffect : List (Signal.Address a) -> a -> Effects ()
broadcastAsEffect outputs data =
  (List.map ((flip Signal.send) data) outputs)
    |> (List.map Effects.task)
    |> Effects.batch


broadcastAsTask : List (Signal.Address a) -> a -> Task x ()
broadcastAsTask outputs data =
  (List.map ((flip Signal.send) data) outputs)
    |> Task.sequence
    |> Task.map (always ())

