
<img src="{{ site.baseurl }}/img/profiles/cppfs-logo.png" alt="cppfs-logo" style="width:50%;"/>

*cppfs* ist eine cross-platform C++ Bibliothek mit objektorientierter Abstraktionsschicht zum Arbeiten mit Dateien und Dateisystemen.
Dabei kann sie für das lokale Dateisystem, aber auch für Netzwerklaufwerke und virtuelle Dateisysteme verwendet werden.
Zum Ergänzen neuer Protokolle und virtuelle Dateisystemtypen ist nur eine Spezialisierung des Backend erforderlich.

[Weiterführende Informationen](https://github.com/cginternals/cppfs) und [Dokumentation](https://www.cppfilesystem.org/docs.html) sind online verfügbar.

Iterieren über Dateisystemordner:

```cpp
#include <cppfs/fs.h>
#include <cppfs/FileHandle.h>

using namespace cppfs;

void listDir(const std::string & path)
{
    FileHandle dir = fs::open(path);

    if (dir.isDirectory())
    {
        for (FileIterator it = dir.begin(); it != dir.end(); ++it)
        {
            std::string path = *it;
        }
    }
}
```

Öffnen einer Datei zum Lesen und Schreiben:

```cpp
#include <cppfs/fs.h>
#include <cppfs/FileHandle.h>

using namespace cppfs;

void openFile(const std::string & filename)
{
    FileHandle fh = fs::open(filename);

    if (fh.isFile())
    {
        auto in = fh.createInputStream();
        // ...

        auto out = fh.createOutputStream();
        // ...
    }
}
```
