module TodoMinMax.Action (Action(..)) where

import Common.Model exposing (Todo)


type Action
  = Update (List Todo)

