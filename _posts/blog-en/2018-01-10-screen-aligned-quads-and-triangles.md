---
layout: blog-post
title: Screen-filling Rasterization using Screen-aligned Quads and Triangles
author: carolin
teaser-figure: /img/posts/blog/scrat-screenaligned-quad

title-figure-type: figure2bc
title-figure-alt1: screen-aligned-quad
title-figure-src1: posts/blog/scrat-screenaligned-quad
title-figure-cap1: Screen-aligned Quad
title-figure-alt2: screen-aligned-triangle
title-figure-src2: posts/blog/scrat-screenaligned-triangle
title-figure-cap2: Screen-aligned Triangle 

abstract: For rendering screen-filling geometry we usually have to choose between a screen-aligned quad and a screen-aligned triangle. But—is there a difference? If so, which approach is better than the other? In this article we want to show you the differences between both approaches and offer an alternative. Following the theoretical analysis we introduce a demo program and evaluate screencasts together with multiple performance measures.
target: Post-processing professionals and GPU enthusiasts 
---

Screen space ambient occlusion _(SSAO)_, fast approximate anti-aliasing _(FXAA)_, deferred shading, image stylization &hellip; all of these techniques have one in common: they utilize offscreen rendering.
Regardless of whether post processing effect or deferred rendering, all techniques and effects need a screen-filling rasterization which is triggered by rendering screen-filling, screen-aligned geometry.
When we hear of screen-aligned geometry, most of us will think about screen-aligned quads and triangles.
But do you know the difference between those?
We want to disucss the differences between both options and provide an alternative.
In order to this we will start with a short theoretical reflection followed by the introduction to our demo program and the evaluation of screencasts and perfomance measures.

For screen-filling rasterization we need screen-aligned geometry that that *completely covers the screen*.
As just mentioned, there are two common approaches to do so: a **(1) screen-aligned&nbsp;quad&nbsp;** that is composed of two triangles _or_ one large, screen covering triangle, called **(2) screen-aligned&nbsp;triangle&nbsp;**.
In addition to these well-known options, there is an alternative that is not that obvious and requires Nvidia's **(3) NV\_fill\_rectangle extension&nbsp;**: You need to render the geometry of only one halve of the screen and the remaining area is automatically rasterized by your graphics card. 
The [*NV\_fill\_rectangle extension*](https://www.khronos.org/registry/OpenGL/extensions/NV/NV_fill_rectangle.txt) was introduced to minimize the number of primitives and---that's interesting for us---to remove the internal edge between two triangles forming a quad. <br />
&emsp;The extension adds the new polygon mode *FILL_RECTANGLE_NV*. Using this mode the GPU rasterizes a triangle by computing and filling its *axis-aligned screen-space bounding box*, neglecting the actual triangle edges. Consequently we need to render only a halved quad---a single triangle whose hypotenuse is the screen's diagonal---to fill the whole screen.
The extension was introduced for *OpenGL&nbsp;4.3* and *OpenGL&nbsp;ES&nbsp;3.1*.

{% assign fig_alt1 = "screen-aligned-quad" %}
{% assign fig_src1 = "posts/blog/scrat-approach-quad" %}
{% assign fig_cap1 = "[1] Screen-aligned Quad" %}
{% assign fig_alt2 = "screen-aligned-triangle" %}
{% assign fig_src2 = "posts/blog/scrat-approach-triangle" %}
{% assign fig_cap2 = "[2] Screen-aligned Triangle" %}
{% assign fig_alt3 = "rectangle-extension" %}
{% assign fig_src3 = "posts/blog/scrat-approach-rectext" %}
{% assign fig_cap3 = "[3] Fill Rectangle Extension" %}
{% assign fig_cap = "The three common geometry alternatives rasterizing a screen-filling quad.<br />All coordinates are measured in <i>Normalized Device Coordiantes</i>. Note that the geometry using the <i>Fill Rectangle Extension</i> covers only halve of the screen." %}
{% include figure3bl_shared_cap.html %}

{% comment %}
#### What happens during rasterization?
{% endcomment %}

Comparing the three alternatives, the crucial difference occurs during **rasterization** which is part of rendering pipeline.
Rasterization is the process by which a primitive is converted to a two-dimensional image and runs after the *programmable vertex processing* (mainly vertex, tessellation, and geometry shaders) and the *fixed-function primitive processing*, including primitive clipping and transformation to window coordinates.<br />
&emsp;The rasterization process consists of mainly two parts: determining which fragments are covered by the primitive and secondly determining the values, such as color and depth, for each fragment of the primitive. 
While the first step is part of the the fixed-function pipeline---and our main interest here---, the fragment's values are calculated based on the programmable *fragment shader*.
Due to focussing and brevity, we will skip all details on fragment shaders and fragment's value computation.<br />
&emsp;The deciding matter of fact is that the rasterizer processes fragments in small pixel groups *(batches)*.
Instead of testing all fragments separately, the rasterizer pre-selects batches by testing their bounding boxes for interesection with the primitive. 
By doing this, a certain amount of single fragment tests may be skipped.
Once the rasterizer selected the batches intersecting the primitive, all fragments within one batch are processed in parallel.<br />
&emsp;The actual batch size varies for different graphics cards and vendors:
It might match with multiples of *Streaming Multiprocessors* on Nvidia graphics cards or comparable concepts introduced by other vendors.
For conception: Nvidia's second generation Maxwell architecture seems to use a batch size of 4&thinsp;&times;&thinsp;8 fragments. <br />
&emsp;While talking about rasterization it is important to not confuse rasterization batches with tile-based rendering---an approach used in mobile graphic cards and probably used in the [current Nvidia's 900 and 1000 series](http://www.realworldtech.com/tile-based-rasterization-nvidia-gpus/){:target="_blank"}.
For a more detailed introduction to reasterization on modern GPUs read [Fabian Giesen's article on theoretical issues](https://fgiesen.wordpress.com/2011/07/06/a-trip-through-the-graphics-pipeline-2011-part-6/){:target="_blank"} and [Christoph Kubisch's article on Nvidia's logical pipline](https://developer.nvidia.com/content/life-triangle-nvidias-logical-pipeline){:target="_blank"}.

#### And where is the beef?

Of course, rasterizing the screen split into batches influences the rendering of our screen-filling geometry as well. 
To comprehend the implications we want to explore the rasterization of the three geometry alternatives in detail. For simplicity, let's assume a 2&thinsp;&times;&thinsp;2 fragment batch size for rasterization. 
<br />
&emsp;**(1)&nbsp;Screen-aligned Quad:**
Since a screen-aligned quad consists of two individual triangles, both are rasterized separately---only batches that intersect the current triangle are rasterized. 
Batches that intersect the diagonal edge of the triangle cause the main difference during rasterization compared to screen-aligned triangles.
Those batches are partially covered by triangle but completely processed by the graphics card since all fragments within one batch are processed in parallel.
Fragments lying outside of the current triangle are discarded.

{% assign fig_alt1 = "scrat-rasterization-left" %}
{% assign fig_src1 = "posts/blog/scrat-rasterization-left" %}
{% assign fig_cap1 = "Left Triangle during Rasterization" %}
{% assign fig_alt2 = "scrat-rasterization-right" %}
{% assign fig_src2 = "posts/blog/scrat-rasterization-right" %}
{% assign fig_cap2 = "Right Triangle after Rasterization" %}
{% assign fig_cap  = "Screen-aligned Quad: Rasterizing the fragment batches at the coincident edges of both triangles. The greyed out fragments are processed but discareded." %}
{% include figure2bc_shared_cap.html %}

At the end of the day this means **doubled amount of work**.
Both triangles share an coincident edge and for both triangles multiple fragments are discarded along this edge.
Adding all discarded fragments together you will see that all fragments of batches intersecting the diagonal are rastered *twice*.
<br />
&emsp;**(2)&nbsp;Screen-aligned Triangle:** 
If we have a look at the rasterization of a screen-aligned triangle, we must consider that the geometry of the triangle extends beyond the screen.
During *primitive clipping* the triangle is cropped to a screen-filling rectangle. 
For the resulting rectangle all intersection tests pass---all tested batches lie within the cropped triangle as well as all fragments within those batches.
Compared to the screen-aligned quad, the screen-aligned triangle approach eliminates doubly processed fragments on triangle edges because the complete bounding box is rasterized as one polygon.
You might worry about the additional work caused by the polygon clipping, but keep in mind that this is extremely cheap for one triangle and independent of fragment count.
<br />
&emsp;**(3)&nbsp;Fill Rectangle Extension:**
Remember the functionality of the *Fill Rectangle Extension*: the rasterizer processes the primitive's axis-aligned screen-space bounding box---which is literally the complete screen in our example.
Consequently this approach behaves equally to a screen-aligned triangle: no doubly processed pixels.

Summarizing the presented considerations, we **expect a slow-down for screen-aligned quads** compared to screen-aligned triangles and *Fill Rectange Extension* usages that is depent on image size and the per-pixel amount of work.
Secondly we expect the effect to be resolution dependent. The batch size keeps constant while for larger screens there is a linear increase for fragments within diagonal batches compared to a major quadratic incrase of global fragment count.

#### Well, that's the theory---What happens in real life?

And now---let's render real geometry and test whether the theory matches real life.
Vendors know the 'problem' and may have solve it in their drivers &hellip; For that purpose we've prepared a short demo program that allows you to track the fragment rasterization sequence on your own system and measure the performance for screen-aligned quad, triangle and *Fill Rectangle Extension* rendering.<br />
&emsp;You are able to switch between the three screen-aligned rendering modes and comprehend the differences in rasterization. Hence the rasterization sequence is visualized by animation at variable speed and colors.
And on a detailed look you might explore the rasterization batch size of your system.
In the following we will explain the main parts of the source code.

[Source Code (and Windows executable) on GitHub](https://github.com/cginternals/blog-demos/releases/tag/screen-aligned-triangle-v1.0.0){:target="_blank"}<br />
<small>Please notice that the demo program requires OpenGL 4.2 (atomic counters).</small>

{% comment %}
Rendering
{% endcomment %}

There are multiple ways of creating the geometry for screen-aligned quads and triangles.
For brevity we don't want to introduce all of them but exemplarily used vertex buffers in our demo.
Two additional methods are shown in the source code.

Create vertex buffer objects and vertex array objects:
{% highlight c++ %}
static const float verticesScrAQ[] = { -1.f, -1.f, -1.f, 1.f, 1.f, -1.f, 1.f, 1.f };
glBindVertexArray(VAO_screenAlignedQuad);
glEnableVertexAttribArray(0);
glBindBuffer(GL_ARRAY_BUFFER, VBO_screenAlignedQuad);
glBufferData(GL_ARRAY_BUFFER, sizeof(float) * 8, verticesScrAQ, GL_STATIC_DRAW);
glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, sizeof(float) * 2, nullptr);
glBindVertexArray(0);

static const float verticesScrAT[] = { -1.f, -1.f, -1.f, 3.f, 3.f, -1.f };
glBindVertexArray(VAO_screenAlignedTriangle);
glEnableVertexAttribArray(0);
glBindBuffer(GL_ARRAY_BUFFER, VBO_screenAlignedTriangle);
glBufferData(GL_ARRAY_BUFFER, sizeof(float) * 6, verticesScrAT, GL_STATIC_DRAW);
glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, sizeof(float) * 2, nullptr);
glBindVertexArray(0);
{% endhighlight %}

(1) Render quad:
{% highlight c++ %}
glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
glBindVertexArray(VAO_screenAlignedQuad);
glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
{% endhighlight %}

(2) Render triangle:
{% highlight c++ %}
glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
glBindVertexArray(VAO_screenAlignedTriangle);
glDrawArrays(GL_TRIANGLES, 0, 3);
{% endhighlight %}

(3) Render halved quad using *NV_fill_rectangle* extension:
{% highlight c++ %}
glPolygonMode(GL_FRONT_AND_BACK, GL_FILL_RECTANGLE_NV);
glBindVertexArray(VAO_screenAlignedQuad);
glDrawArrays(GL_TRIANGLES, 0, 3);
{% endhighlight %}

{% comment %}
#### Program Execution
{% endcomment%}

For program execution we use a *continuous rendering* approach and splitted the main loop into two phases: *recording* and *replay*. 
In the first phase, the sequence of fragment rasterization is recorded---if it wasn't so far or reset.
Following this, the recorded sequence is incrementally replayed. <br />
&emsp;To record the rasterization sequence each fragment needs to know its placement during rasterization.
Therefor we use an *atomic counter* in the fragment shader. The value of the atomic counter is increased per processed fragment. 
Due to the atomicity each fragment gets an unique sequence number---fragments that are processed in parallel are sequenced for *atomic increment operations*.
The result is written into an offscreen framebuffer, containing the sequence numbers of all fragments.

*The sequence numbers are written into a ```FLOAT``` texture instead of a more sensible ```INTEGER``` texture since not all AMD graphics cards support this texture type.*

{% highlight glsl %}
layout(binding = 0, offset = 0) uniform atomic_uint ac;
...
uint aci = atomicCounterIncrement(ac);
out_color = float(aci);
{% endhighlight%}

To make the rasterization sequence visible we need to vastly slow down the rendering process.
Since a real slow down is not possible we utilize the continuous rendering approach to incrementally construct the final image.
For each render call a threshold determines up to which sequence number fragments will be rendered, all fragments with higher sequence numbers are discarded.
As a result the recorded fragment sequence is visually constructed step by step with preceding time. <br />
&emsp;We use the three color channels of the HSL color model to visualize proceeding fragment rasterization.
While the hue value ranges only once from 0° (red) to 360° (red) for all fragments, the saturation and luminance restart their values every 256 and 65&#8239;536 fragments respectively.
A highlighting fence was added to emphasize the current rasterization progress.
Knowing this you're able to quickly estimate fragment counts.<br />
&emsp;The performance measurement is split into two phases: warm up and actual measurement. We added the warm up phase to get more stable results, since the GPU might speed up to maximum performance at the beginning and slow down to a resonable level a few seconds later. 
We used 150&#8239;000 iterations for the warm up phase.
During the performance tests we used 10&#8239;000 iterations utilizing an empty shader without sequence recording to remove possible side effects caused by the atomic increment.

{% comment %}
- colors ( reset step size)
{% endcomment %}

#### Rasterization Sequencing and Performance Results

We ran our demo program using different graphics cards to test whether our assumptions on sequencing match and whether the expected slow-down occurs.
The three typical vendors Nvidia, AMD and Intel are represented each with one current and one prior graphics card.
Well, none of us owns this zoo of graphics cards all by oneself. 
That's why we didn't test all graphics cards on a single system.

The tested graphics cards were:

* Intel HD Graphics 4600 _(Haswell)_ and Intel HD Graphics 530 _(Skylake)_
* AMD Radeon HD 6950 _(TeraScale 3)_ and AMD Radeon R9 280 _(Tahiti)_
* Nvidia GeForce GT 420M _(Fermi)_ and Nvidia GeForce GTX 970 _(Maxwell)_
<br />
<br />
{% comment %}
Rasterization Sequencing Results:
{% endcomment %}
{% assign vid_src = "https://www.youtube.com/embed/gmRSNcJxMG0" %}
{% assign vid_allowfullscreen = false %}
{% include video16by9.html %}

<br />
Viewing the different rasterization sequences we can note that nearly all graphics cards rasterize as suggested.
Generalized we might say that the expected differences between screen-aligned quads and triangles exist with no differences between screen-aligned triangle and *Fill Rectangle Extension* (if supported).
All graphics cards but the **Nvidia&nbsp;GeForce&nbsp;GTX&nbsp;970** rasterize the triangles of the screen-aligned quad seperately predominantly using a scan-line rasterization algorithm. 
Notwithstanding the AMD graphics cards previously divide the screen into subrectangles and the **AMD&nbsp;Radeon&nbsp;R9&nbsp;280** shows a more sophisticated rasterization algorithm.<br />
&emsp;Compared to the others the current Nvidia graphics card reveals a remarkable rasterization sequence:
The driver mostly hides the problem and rasterizes the whole screen instead of separate triangles---both triangles are rendered interleaved although we are able to see the quad's diagonal for the screen-aligned quad.
Please note that the **Nvidia&nbsp;GeForce&nbsp;GTX&nbsp;970**, as well as its successors, is the only graphics card in our selection that supports the *Fill Rectangle Extension*.
Additionally you can recognize the typical rasterization pattern for a tiled-rendering approach.<br />
&emsp;For integrity let me tell you that the observed rasterization sequences do not change for larger windows and other window formats.
But now let's see whether this becomes apparent in performance measurement.
<br />
<br />

{% comment %}
[AMD Radeon RX 480 error proposed by Christophe Riccio](https://twitter.com/g_truc/status/879660950978256896)
{% endcomment %}

{% comment %}
#### Measure Performance for more complex shader?
##### Performance Results
Performance Results:
{% endcomment %}


| GC                     | Quad             | Triangle         | Extension         |
| :--------------------- | ---------------: | ---------------: | ----------------: |
| Intel HD Graphics 4600 | 498.79&thinsp;µs | 496.49&thinsp;µs |  --               |
| Intel HD Graphics 530  | 235.28&thinsp;µs | 189.79&thinsp;µs |  --               |
| AMD Radeon HD 6950     |  27.88&thinsp;µs |  27.55&thinsp;µs |  --               | 
| AMD Radeon R9 280      |  26.32&thinsp;µs |  26.16&thinsp;µs |  --               |
| Nvidia GeForce 420M    | 257.53&thinsp;µs | 255.79&thinsp;µs |  --               |
| Nvidia GeForce GTX 970 |  23.13&thinsp;µs |  23.14&thinsp;µs |   23.14&thinsp;µs | 


For performance measurement we used the 910&#8239;&times;&#8239;640 resolution from the screencast. 
Since we used different system configurations, we compared the performance of all three modes for one vendor and not between vendors.<br />
&emsp;If we look at the results, we have to notice that there are at most no huge differences---but we didn't expect to be so, eh?
Anyway we can see that, except for the **Nvidia&nbsp;GeForce&nbsp;GTX&nbsp;970**, the performance for screen-aligned quads is worse than for screen-aligned triangles.
Even if the performance differences appear to be very small they are reproducible.
For most graphics cards the effect is nominal but there are two differences that are worth a closer inspection.
**Intel&nbsp;HD&nbsp;Graphics&nbsp;530** performs significantly worse using a screen-aligned quad.
The difference is considerably larger than for all other graphics cards and vendors and is almost reaching **25&#8239;%**.
Even for rasterizing a 4K image---we would expect that the effect nearly vanishes---the performance difference is larger than **15&#8239;%**.
In contrast to this **Nvidia&nbsp;GeForce&nbsp;GTX&nbsp;970**'s results do not differ in performance for all modes.
The driver hides the diagonal as expected and offers **equivalent results for all three geometry alternatives**. 


#### What's the take home message?

Well, that was a lot of stuff.
The good news are, that you dont't need to remember anything---only keep the core messages in mind: 
 - For screen-filling rasterization there are mainly three kinds of geometry: (1) a screen-aligned quad, (2) a screen-aligned triangle, and (3) a smaller triangle utilizing Nvidia's *Fill Rectangle Extension* (if supported).
 - The main differences occur during rasterization: 
   - The screen is split into small rasterization batches that cause doubled amount of work along the triangles' diagonals using a screen-aligned quad.
   - For fragment shaders with intense memory access the separation of the screen aligned quad's triangles causes cache misses at triangle switch.
 - There is a performance difference, at least for some graphics cards.
 <br /><br />

### Prefer **screen-aligned triangles** or **NV_fill_rectangle** to screen-aligned quads for screen-filling rasterization! 
<br />

----

#### Update

Our explanations and the demo program focus on doubly rasterized fragments.
Beyond that, Michal Drobot investigated the differences between screen aligned quads and triangles regarding cache utilization in his [article on execution patterns in full screen passes](https://michaldrobot.com/2014/04/01/gcn-execution-patterns-in-full-screen-passes/){:target="_blank"}.
For intense memory access he shows that rendering the two triangles of a screen aligned quad has a worse locality of reference compared to a screen aligned triangle.
When the rasterizer switches from the first triangle to the second they assume the cache to be completely invalidated---which causes a significant slow down for fragment shaders with intense memory access.
Drobot measured a slow down of approximately 10&thinsp;% compared to a screen aligned triangle. 
We would like to thanks [A. Sawicki](http://asawicki.info/){:target="_blank"} who drew our attention to Drobot's article.

{% comment %}
your experiment showed very minimal increase in performance when switching from quad to a single triangle because of the nature of workload of your fragment shader. The biggest increase in performance you may get from this optimization comes from better utilization of cache memory due to better locality of reference, when your shader is intensive on memory access.
{% endcomment %}
