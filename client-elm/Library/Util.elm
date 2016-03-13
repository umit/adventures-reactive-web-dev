module Library.Util (broadcast) where

import Effects exposing (Effects)


broadcast : List (Signal.Address a) -> a -> Effects ()
broadcast outputs data =
  (List.map ((flip Signal.send) data) outputs)
    |> (List.map Effects.task)
    |> Effects.batch

