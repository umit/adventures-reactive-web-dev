import Char
import Html exposing (Attribute, Html, div, input, text)
import Html.Attributes as Attr exposing (placeholder, style, value)
import Html.Events exposing (on, targetValue)
import Http
import Json.Decode as Json exposing ((:=))
import String
import Task exposing (Task, andThen, fail, mapError, succeed)


-- VIEW

view : Signal.Address String -> String -> Result String (List String) -> Html
view address qry result =
  let field =
        input
          [ placeholder "Zip Code"
          , value qry
          , on "input" targetValue (Signal.message address)
          , myStyle
          ]
          []

      messages =
        case result of
          Err msg ->
              [ div [ myStyle ] [ text msg ] ]

          Ok cities ->
              List.map (\city -> div [ myStyle ] [ text city ]) cities
  in
      div [] (field :: messages)


myStyle : Attribute
myStyle =
  style
    [ ("width", "100%")
    , ("height", "40px")
    , ("padding", "10px 0")
    , ("font-size", "2em")
    , ("text-align", "center")
    ]


-- WIRING

main =
  Signal.map2 (view query.address) query.signal results.signal


query : Signal.Mailbox String
query =
  Signal.mailbox ""


results : Signal.Mailbox (Result String (List String))
results =
  Signal.mailbox (Err "A valid US zip code is 5 numbers.")


-- andThen : Task x a -> (a -> Task x b) -> Task x b
-- toResult : Task x a -> Task never (Result x a)
-- send : Address a -> a -> Task x ()
-- message : Address a -> a -> Message


lookupTaskSignal : Signal String -> Signal (Task String (List String))
lookupTaskSignal =
  Signal.map lookupZipCode


taskToResult : Task String (List String) -> Task never (Result String (List String))
taskToResult =
  Task.toResult


sendResults : Result String (List String) -> Task x ()
sendResults =
  Signal.send results.address


port requests : Signal (Task x ())
port requests =
  lookupTaskSignal query.signal
    |> Signal.map (\t -> andThen (taskToResult t) sendResults)


toUrl : String -> Task String String
toUrl qry =
  if String.length qry == 5 && String.all Char.isDigit qry
    then succeed ("http://api.zippopotam.us/us/" ++ qry)
    else fail "Invalid zip code."


places : Json.Decoder (List String)
places =
  let place =
        Json.object2 (\city state -> city ++ ", " ++ state)
          ("place name" := Json.string)
          ("state" := Json.string)
  in
      "places" := Json.list place


httpGet : Json.Decoder a -> String -> Task Http.Error a
httpGet = Http.get


getPlaces : String -> Task Http.Error (List String)
getPlaces =
  httpGet places


handleError : Task Http.Error (List String) -> Task String (List String)
handleError =
  mapError (always "Not found.")


loadPlaces : String -> Task String (List String)
loadPlaces =
  getPlaces >> handleError


lookupZipCode : String -> Task String (List String)
lookupZipCode qry =
  toUrl qry `andThen` loadPlaces


