
<img src="{{ site.baseurl }}/img/profiles/cpplocate-logo.png" alt="cpplocate-logo" style="width:50%;"/>

*cpplocate* ist eine cross-platform C++ Bibliothek, die Funktionen für Software bereitstellt, ihre Assets und Daten zur Laufzeit zu lokalisieren.
Die Bibliothek unterstützt verschiedene Setups wie Applikationen, Bibliotheken oder *App Bundles*.
Für den allgemeinen Anwendungsfall, die eigenen Daten zu finden, stellt die Bibliothek eine separate Funktion bereit.
Intern ist cpplocate in reinem C implementiert. Die ebenfalls mitgelieferte Bibliothek *liblocate* ist für Projekte gedacht, die nicht mit einer C++ Schnittstelle arbeiten wollen.

[Weiterführende Informationen](https://github.com/cginternals/cpplocate) und [Dokumentation](https://cpplocate.org/docs.html) sind online verfügbar.

Beispiel:

```cpp
#include <cpplocate/cpplocate.h>

#include <glbinding/gl/gl.h>

const std::string assetPath = cpplocate::locatePath("data/cubescape", "share/glbinding", reinterpret_cast<void *>(&gl::glCreateShader));
// assetPath now contains the path to the directory containing "data/cubescape"
```
