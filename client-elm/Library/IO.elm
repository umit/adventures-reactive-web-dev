module Library.IO
  ( MbTask
  ) where

import Effects exposing (Never)
import Maybe exposing (Maybe)
import Task exposing (Task)


type alias MbTask a = Maybe (Task Never a)
