
<img src="{{ site.baseurl }}/img/profiles/cppassist-logo.png" alt="cppassist-logo" style="width:50%;"/>

*cppassist* ist eine Sammlung von cross-platform C++ Funktionen, Klassen und Bibliotheken, welche für sich genommen zu klein für eine eigenständige Bibliothek wären. Dabei wird diese Bibliothek als Sammelort für nützlichen und wiederverwendbaren Code benutzt, welcher bei der Programmierung mit C++ wiederkehrend benötigt wird.

[Weiterführende Informationen](https://github.com/cginternals/cppassist) und [Dokumentation](https://cppassist.org/docs.html) sind online verfügbar.

Zum aktuellen Stand bestehht *cppassist* aus folgenden Modulen:
* cmdline: Ein Command Line Parser für Konsolenanwendungen
* flags: Ein Flag-Datentyp um das Sprachkonstrukt *enum* für bitweise Flag-Manipulation zu verwenden
* fs: Hilfsklassen zum Lesen von Binärdateien mit Key-Value Header Informationen
* logging: C++-Stream-artige Schnittstelle zum Loggen mit konfigurierbarer Ausgabe
* memory: Hilfskonstrukte für Speichermanagement
* simd: Strukturen und Algorithmen für SIMD Datenprozessierung mittels SSE und AVX
* string: Hilfsfunktionen für Konvertierungen von und zu Strings, Manipulationen von Strings und regulären Ausdrücken
* threading: Hilfsfunktionen für nebenläufige Schleifenausführung
* tokenizer: Ein Basis-Tokenizer, z.B. zum Parsen von Texten wie Konfigurationsdateien
* typelist: Ein Datentyp zur Iteration über eine Liste von Datentypen, umgesetzt durch Instanziierung von Templates

Beispiel zu logging:

```cpp
#include <cppassist/logging/logging.h>

cppassist::setVerbosityLevel(LogMessage::Debug + 2);

cppassist::critical() << "A normal critical message.";
cppassist::error() << "A normal error message.";
cppassist::warning() << "A normal warning message.";
cppassist::info() << "A normal info message.";
cppassist::debug() << "A normal debug message.";
cppassist::debug(1) << "Another debug message.";

cppassist::info("A") << "Info message from context A";
cppassist::warning("B") << "Warning from context B";
cppassist::critical("C") << "Critical message from context C";
```

Beispiel zur Stringmanipulation:

```cpp
#include <cppassist/string/manipulation.h>

const auto commaSeparatedList = cppassist::join({ 1, 2, 3, 4, 5}, ",");
const auto stringVector = cppassist::split("1,2,3,4,5", ',', false);
const auto trimmedString = cppassist::trim("     Hallo     ");
const auto strippedString = cppassist::stripped("1-2-3-4-5-6", { '-' });
```

Beispiel zu threading:
```
#include <cppassist/threading/parallelfor.h>

bool parallelize = size > 25; // use parallel computation if threshold is reached

// Beware that start and end are both inclusive
cppassist::forEach(0u, size, [this](std::uint32_t number)
{
    // concurrent calls of this with 0 <= number <= size
}, parallelize);
```

Tokenizer Beispiel:

```cpp
#include <cppassist/tokenizer/Tokenizer.h>

// Create tokenizer for JSON
cppassist::Tokenizer tokenizer;

tokenizer.setOptions(
    cppassist::Tokenizer::OptionParseStrings
    | cppassist::Tokenizer::OptionParseNumber
    | cppassist::Tokenizer::OptionParseBoolean
    | cppassist::Tokenizer::OptionParseNull
    | cppassist::Tokenizer::OptionCStyleComments
    | cppassist::Tokenizer::OptionCppStyleComments
);

tokenizer.setQuotationMarks("\"");
tokenizer.setSingleCharacters("{}[],:");
```
