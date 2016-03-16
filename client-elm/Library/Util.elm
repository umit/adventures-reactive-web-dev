module Library.Util (actionEffect, broadcastAsEffect, broadcastAsTask) where

import Effects exposing (Effects)
import Task exposing (Task, succeed)


actionEffect : a -> Effects a
actionEffect action =
  Effects.task (succeed action)


broadcastAsEffect : List (Signal.Address d) -> a -> d -> Effects a
broadcastAsEffect outputs action data =
  (List.map ((flip Signal.send) data) outputs)
    |> (List.map Effects.task)
    |> Effects.batch
    |> Effects.map (always action)


broadcastAsTask : List (Signal.Address d) -> a -> d -> Task x a
broadcastAsTask outputs action data =
  (List.map ((flip Signal.send) data) outputs)
    |> Task.sequence
    |> Task.map (always action)

