module TodoSummary.Action (Action(..)) where

import Common.Model exposing (Todo)


type Action
  = Update (List Todo)
  | LastSaved (Maybe Todo)

