The frontend of my todo app made with angular 2

## [2016-01-16]

Actually I try to create a StateTree that represents the App. I use a mix of Immutable Objects and Observables.
So far the problem exist that ngFor does not support such a thing. On a change in a list the components of the changed items will be recreated.
I solved this for now with a Pipe that transforms Immutable Collection into a collection with ReplaySubjects that publish the values in the list.
This way the components will not get recreated when a value in the list changes. When a new value comes the pipe searches for a subject to this value (tracked by a key) and sends the value.

Drawback: the component has to subscribe to the Observable to get the new value.

