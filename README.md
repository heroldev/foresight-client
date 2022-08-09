Foresight
====
Pokémon Storage. Simplified.

> A **PC** (Japanese: パソコン personal computer) is a technology used in the core series Pokémon games from Generation I to VII. They are found in every Pokémon Center, as well as in any main character's bedroom, in all Secret Bases in the form of a laptop, and sometimes in other buildings as well. Their primary purpose is for storing Pokémon and items. 
(from Bulbapedia, the community-driven Pokémon encyclopedia.)
## The Premise
Foresight is meant to be an IRL Pokémon storage webapp, similar to the **Pokemon Storage System** (in the main series games) or the **Deck Machine** (in the Pokémon Trading Card Game video games), but with the combined functionality of both. Think of it as an always-on Minicom.

- Store your Pokémon trading card decklists to make edits, analyze potential changes using helpful visualizations, and ensure your deck is in tip-top shape for your next challenge.

Named for the Pokémon attack **Foresight**, this program is meant to serve as the ultimate resource for identifying and storing your Pokémon TCG decks.

## The Purpose
This app is being developed out of my love for the Pokémon games and the franchise that has brought me thousands of hours of joy over the years.

I've always wanted a an app that serves as a quick reference for all of my TCG decks. Seeing no resouce that provides this similar suite of functionality, Foresight's end goal is to be able to do it all (and maybe more.)

## Building and Execution
- Foresight's frontend (stored in `/client`) uses `create-react-app`. Run the necessary npm scripts to get it up and running.
- Foresight's backend (stored in `/server`) uses Go to field requests. Test the server using `go run main.go` after running `go mod tidy`. **As Foresight currently uses local storage, the server functionality serves no purpose in deployment.**

## Special Thanks
- Sprites are retrieved from https://msikma.github.io/pokesprite/.
- Foresight's data is taken from https://pokemontcg.io/.

#### Disclaimer
I do not support or condone cheating at the expense of others. Do not use significantly hacked Pokémon in battle or in trades with those who are unaware hacked Pokémon are in use. In addition, all rights of the Pokémon franchise are reserved for their respective owners - TPCi, GAME FREAK, Creatures, Inc., and Nintendo, Ltd.
