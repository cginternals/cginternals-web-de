
<img src="{{ site.baseurl }}/img/profiles/cppfs-logo.png" alt="cppfs-logo" style="width:50%;"/>

*cppfs* is a cross-platform C++ library that provides an object-oriented abstraction for working with files and the file system.
It can be used not only to access the local file system, but for remote and virtual file systems as well. By specializing the virtual backend interface, cppfs can be easily extended to support additional remote protocols or virtual file systems.

[Full description](https://github.com/cginternals/cppfs) and [documentation](https://cppfilesystem.org/docs.html) are available, too.

Listing directory entries:

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

Open a file for reading or writing:

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
