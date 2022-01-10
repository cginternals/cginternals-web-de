
<img src="{{ site.baseurl }}/img/profiles/cpplocate-logo.png" alt="cpplocate-logo" style="width:50%;"/>

*cpplocate* is a cross-platform C++ library that provides tools for applications to locate their binary files and data assets, as well as those of dependent modules.
It supports queries of different paths, depending on the type of the component in question (application, library, or application bundle). For the most basic use case, cpplocate is used to detect run-time data that is associated with a module, and we provide a convenience location function. 
Internally, *cpplocate* is implemented using plain C, providing a C++ interface for ease of use. For communities and software that don't want to use C++, the *liblocate* within this project can be used instead.

[Full description](https://github.com/cginternals/cpplocate) and [documentation](https://cpplocate.org/docs.html) are available, too.

Example:

```cpp
#include <cpplocate/cpplocate.h>

#include <glbinding/gl/gl.h>

const std::string assetPath = cpplocate::locatePath("data/cubescape", "share/glbinding", reinterpret_cast<void *>(&gl::glCreateShader));
// assetPath now contains the path to the directory containing "data/cubescape"
```
