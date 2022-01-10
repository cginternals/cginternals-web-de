
<img src="{{ site.baseurl }}/img/profiles/cppexpose-logo.png" alt="cppexpose-logo" style="width:50%;"/>

*cppexpose* ist eine cross-platform C++ Bibliothek zur Introspektion von Typen, Attributen und Klassen.
Das ermöglicht das dynamische Anbieten und Verarbeiten von Programmschnittstellen zur Laufzeit, was wiederum benutzt werden kann um z. B. automatische Formulare oder andere grafische Oberflächen zu erstellen oder C++ Objekte in Skripten zu verwenden.
Die Implementierung basiert auf standard C++11 ohne Spracherweiterungen und ohne separatem Compiler, was die Integration vereinfacht und Typsicherheit gewährleistet.

[Weiterführende Informationen](https://github.com/cginternals/cppexpose) und [Dokumentation](https://cppexpose.org/docs.html) sind online verfügbar.

Komponentenkonzept und Plugins:

```cpp
int main(int, char * [])
{
    // Create a component manager
    cppexpose::ComponentManager componentManager;

    // Search for plugins in the current working directory
    componentManager.addPluginPath(".");
    componentManager.scanPlugins();

    // List available components
    std::cout << "Components:" << std::endl;
    std::cout << std::endl;
    for (cppexpose::AbstractComponent * component : componentManager.components())
    {
        std::cout << "----------------------------------------" << std::endl;
        std::cout << "name:        " << component->name() << std::endl;
        std::cout << "type:        " << component->type() << std::endl;
        std::cout << "description: " << component->description() << std::endl;
        std::cout << "tags:        " << component->tags() << std::endl;
        std::cout << "annotations: " << component->annotations() << std::endl;
        std::cout << "vendor:      " << component->vendor() << std::endl;
        std::cout << "version:     " << component->version() << std::endl;
        std::cout << "----------------------------------------" << std::endl;
        std::cout << std::endl;
    }
}
```

Introspektion in Klassen:

```cpp
// Create object and print its initial contents
MyObject obj;
obj.print();

// Enumerate properties
std::cout << "Properties:" << std::endl;
for (auto it : obj.properties())
{
    cppexpose::AbstractProperty * property = it.second;
    std::cout << "- " << property->name() << " (" << property->typeName() << ")" << std::endl;
}
std::cout << std::endl;
```

Scripting:

```cpp
int main(int, char * [])
{
    ScriptContext scriptContext;

    // Create scripting environment
    Object script("script");
    scriptContext.addGlobalObject(&script);

    MyObject obj ("obj");
    script.addProperty(&obj);

    TreeNode tree("tree");
    script.addProperty(&tree);

    // Provide a script console
    bool done = false;
    while (!done && !std::cin.eof())
    {
        // Prompt
        std::cout << "> " << std::flush;

        // Read command
        std::string cmd;
        std::getline(std::cin, cmd);

        // Process command
        if (cmd != "exit") {
            Variant result = scriptContext.evaluate(cmd);
            std::cout << result.toString() << std::endl;
        } else done = true;
    }

    // Exit application
    return 0;
}
```
