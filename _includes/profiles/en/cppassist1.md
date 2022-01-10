
<img src="{{ site.baseurl }}/img/profiles/cppassist-logo.png" alt="cppassist-logo" style="width:50%;"/>

*cppassist* is a collection of cross-platform C++ functions, classes and libraries that are too small to be standalone. It acts like a storage point for useful and reusable code for everyone using C++.

[Full description](https://github.com/cginternals/cppassist) and [documentation](https://cppassist.org/docs.html) are available, too.

As of now, *cppassist* is structured into these modules:
* cmdline: Command line arguments parser for console applications
* flags: Flags type to help using enums as flags
* fs: Classes to access raw files and their key-value structured header information
* logging: Stream like logging functionality with customizable outputs (default output is to the console)
* memory: Low-level memory management helpers
* simd: Structures and algorithms for SIMD-like data processing, as introduced by GPUs. This is achieved by compiler extensions as SSE, AVX2, and AVX512
* string: Utilities like conversion between string and numeric data types, convenience functions for string operations, and some advanced regex functionality
* threading: Wrapper around concurrent loop execution
* tokenizer: Low-level tokenizer as base for more elaborate text parsers
* typelist: TypeList type that allows calling different instantiations of a templated method consecutively

Logging Example:

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

String manipulation:

```cpp
#include <cppassist/string/manipulation.h>

const auto commaSeparatedList = cppassist::join({ 1, 2, 3, 4, 5}, ",");
const auto stringVector = cppassist::split("1,2,3,4,5", ',', false);
const auto trimmedString = cppassist::trim("     Hallo     ");
const auto strippedString = cppassist::stripped("1-2-3-4-5-6", { '-' });
```

Threading:
```
#include <cppassist/threading/parallelfor.h>

bool parallelize = size > 25; // use parallel computation if threshold is reached

// Beware that start and end are both inclusive
cppassist::forEach(0u, size, [this](std::uint32_t number)
{
    // concurrent calls of this with 0 <= number <= size
}, parallelize);
```

Tokenizer:

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
