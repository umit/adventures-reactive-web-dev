module Library.Util (actionEffect, broadcast) where

import Effects exposing (Effects)
import Task exposing (succeed)


actionEffect : a -> Effects a
actionEffect action =
  Effects.task (succeed action)


broadcast : List (Signal.Address d) -> d -> a -> Effects a
broadcast outputs data action =
  (List.map ((flip Signal.send) data) outputs)
    |> (List.map Effects.task)
    |> Effects.batch
    |> Effects.map (always action)

