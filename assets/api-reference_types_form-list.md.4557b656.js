import{_ as s,o as n,c as a,a as l}from"./app.a42c7a3e.js";const i=JSON.parse('{"title":"Form List Typings","description":"","frontmatter":{"title":"Form List Typings"},"headers":[{"level":2,"title":"FormListProps","slug":"formlistprops","link":"#formlistprops","children":[]},{"level":2,"title":"FormListInstance","slug":"formlistinstance","link":"#formlistinstance","children":[]}],"relativePath":"api-reference/types/form-list.md"}'),p={name:"api-reference/types/form-list.md"},o=l(`<h1 id="form-list-typings" tabindex="-1">Form List Typings <a class="header-anchor" href="#form-list-typings" aria-hidden="true">#</a></h1><h2 id="formlistprops" tabindex="-1">FormListProps <a class="header-anchor" href="#formlistprops" aria-hidden="true">#</a></h2><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">FormListProps</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">label</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> (</span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;">)[]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">defaultValue</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">getValueFromChangeEvent</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">event</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">valueTransformer</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">FormItemValueTransformer</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">validateTrigger</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ValidateTrigger</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ValidateTrigger</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">rules</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Rule</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">requiredMark</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">validateFirst</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="formlistinstance" tabindex="-1">FormListInstance <a class="header-anchor" href="#formlistinstance" aria-hidden="true">#</a></h2><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">FormListInstance</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#C792EA;">extends</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Omit</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">FormItemInstance</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">handleBlur</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">handleChange</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">listValues</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ComputedRef</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">any</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">&gt;;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">namePrefix</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ComputedRef</span><span style="color:#89DDFF;">&lt;</span><span style="color:#A6ACCD;">(</span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;">)[]</span><span style="color:#89DDFF;">&gt;;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">namePaths</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ComputedRef</span><span style="color:#89DDFF;">&lt;</span><span style="color:#A6ACCD;">(</span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;">)[][]</span><span style="color:#89DDFF;">&gt;;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">errors</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ComputedRef</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">ValidateError</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">&gt;;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">getNamePath</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">index</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">NamePath</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> (</span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;">)[]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">getErrors</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">index</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ValidateError</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">hasError</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">index</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">add</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">newValue</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">remove</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">index</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">removeByKey</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">replace</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">index</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">newValue</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">swap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">firstIndex</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">secondIndex</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">move</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">fromIndex</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">toIndex</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,5),e=[o];function t(r,c,F,D,y,C){return n(),a("div",null,e)}const B=s(p,[["render",t]]);export{i as __pageData,B as default};