export namespace JSX {
  export type Element = Node;

  export type CSSStyleProps = {
    [key in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[key];
  };

  export type GlobalAttributes<T = HTMLElement> = {
    accessKey?: string;
    autofocus?: boolean;
    class?: string;
    contentEditable?: boolean;
    data?: Record<string, unknown>;
    dir?: string;
    draggable?: boolean;
    enterKeyHint?: string;
    exportparts?: string;
    hidden?: boolean;
    id?: string;
    inert?: boolean;
    inputMode?: string;
    itemID?: string;
    itemProp?: string;
    itemRef?: string;
    itemScope?: boolean;
    itemType?: string;
    lang?: string;
    nonce?: string;
    part?: string;
    popover?: string;
    role?: string;
    slot?: string;
    spellcheck?: boolean;
    style?: string | CSSStyleProps;
    tabIndex?: number;
    title?: string;
    translate?: 'yes' | 'no';

    onabort?: (this: T, ev: Event) => void;
    onanimationcancel?: (this: T, ev: AnimationEvent) => void;
    onanimationend?: (this: T, ev: AnimationEvent) => void;
    onanimationiteration?: (this: T, ev: AnimationEvent) => void;
    onanimationstart?: (this: T, ev: AnimationEvent) => void;
    onauxclick?: (this: T, ev: MouseEvent) => void;
    onblur?: (this: T, ev: FocusEvent) => void;
    oncancel?: (this: T, ev: Event) => void;
    oncanplay?: (this: T, ev: Event) => void;
    oncanplaythrough?: (this: T, ev: Event) => void;
    onchange?: (this: T, ev: Event) => void;
    onclick?: (this: T, ev: MouseEvent) => void;
    onclose?: (this: T, ev: Event) => void;
    ondrag?: (this: T, ev: DragEvent) => void;
    ondragend?: (this: T, ev: DragEvent) => void;
    ondragenter?: (this: T, ev: DragEvent) => void;
    ondragexit?: (this: T, ev: DragEvent) => void;
    ondragleave?: (this: T, ev: DragEvent) => void;
    ondragover?: (this: T, ev: DragEvent) => void;
    ondragstart?: (this: T, ev: DragEvent) => void;
    ondrop?: (this: T, ev: DragEvent) => void;

    onerror?: (this: T, ev: Event | ErrorEvent) => void;
    onfocus?: (this: T, ev: FocusEvent) => void;
    oninput?: (this: T, ev: Event) => void;
    oninvalid?: (this: T, ev: Event) => void;
    onkeydown?: (this: T, ev: KeyboardEvent) => void;
    onkeypress?: (this: T, ev: KeyboardEvent) => void;
    onkeyup?: (this: T, ev: KeyboardEvent) => void;
    onload?: (this: T, ev: Event) => void;
    onloadeddata?: (this: T, ev: Event) => void;
    onloadedmetadata?: (this: T, ev: Event) => void;
    onloadstart?: (this: T, ev: Event) => void;
    onmousedown?: (this: T, ev: MouseEvent) => void;
    onmouseenter?: (this: T, ev: MouseEvent) => void;
    onmouseleave?: (this: T, ev: MouseEvent) => void;
    onmousemove?: (this: T, ev: MouseEvent) => void;
    onmouseout?: (this: T, ev: MouseEvent) => void;
    onmouseover?: (this: T, ev: MouseEvent) => void;
    onmouseup?: (this: T, ev: MouseEvent) => void;
    onpause?: (this: T, ev: Event) => void;
    onplay?: (this: T, ev: Event) => void;
    onplaying?: (this: T, ev: Event) => void;
    onprogress?: (this: T, ev: ProgressEvent<EventTarget>) => void;
    onratechange?: (this: T, ev: Event) => void;
    onreset?: (this: T, ev: Event) => void;
    onresize?: (this: T, ev: UIEvent) => void;
    onscroll?: (this: T, ev: UIEvent) => void;
    onseeked?: (this: T, ev: Event) => void;
    onseeking?: (this: T, ev: Event) => void;
    onselect?: (this: T, ev: Event) => void;
    onstalled?: (this: T, ev: Event) => void;
    onsubmit?: (this: T, ev: SubmitEvent) => void;
    onsuspend?: (this: T, ev: Event) => void;
    ontimeupdate?: (this: T, ev: Event) => void;
    onvolumechange?: (this: T, ev: Event) => void;
    onwaiting?: (this: T, ev: Event) => void;
  };

  export type Children = Element | string | number | boolean | null | undefined | Children[];

  type ParentAttributes<T = HTMLElement> = GlobalAttributes<T> & {
    children?: Children;
  };

  type InputAllAttributes = GlobalAttributes<HTMLInputElement> & {
    disabled?: boolean;
    form?: string;
    name?: string;
  };

  type InputAttributes = InputAllAttributes &
    (
      | {
          type: 'button';
          popovertarget?: string;
          popovertargetaction?: string;
          value?: string;
        }
      | {
          type: 'checkbox';
          checked?: boolean;
          required?: boolean;
          value?: string;
        }
      | {
          type: 'color';
          colorspace?: string;
          list?: string;
          value?: string;
        }
      | {
          type: 'date';
          list?: string;
          max?: string;
          min?: string;
          readonly?: boolean;
          required?: boolean;
          step?: number;
          value?: string;
        }
      | {
          type: 'datetime-local';
          list?: string;
          max?: string;
          min?: string;
          readonly?: boolean;
          required?: boolean;
          step?: number;
          value?: string;
        }
      | {
          type: 'email';
          dirname?: string;
          list?: string;
          maxlength?: number;
          minlength?: number;
          pattern?: string;
          placeholder?: string;
          readonly?: boolean;
          required?: boolean;
          size?: number;
          value?: string;
        }
      | {
          type: 'file';
          accept?: string;
          capture?: boolean | string;
          list?: string;
          multiple?: boolean;
          required?: boolean;
          value?: string;
        }
      | {
          type: 'hidden';
          value?: string;
        }
      | {
          type: 'image';
          formaction?: string;
          formenctype?: string;
          formmethod?: string;
          formnovalidate?: boolean;
          formtarget?: string;
          height?: number | string;
          src?: string;
          width?: number | string;
        }
      | {
          type: 'number';
          list?: string;
          max?: number | string;
          min?: number | string;
          placeholder?: string;
          required?: boolean;
          step?: number | string;
          value?: string;
        }
      | {
          type: 'password';
          maxlength?: number;
          minlength?: number;
          pattern?: string;
          placeholder?: string;
          readonly?: boolean;
          required?: boolean;
          size?: number;
          value?: string;
        }
      | {
          type: 'radio';
          checked?: boolean;
          required?: boolean;
          value?: string;
        }
      | {
          type: 'range';
          list?: string;
          max?: number | string;
          min?: number | string;
          step?: number | string;
          value?: string;
        }
      | {
          type: 'reset';
          value?: string;
        }
      | {
          type: 'search';
          dirname?: string;
          list?: string;
          maxlength?: number;
          minlength?: number;
          pattern?: string;
          placeholder?: string;
          required?: boolean;
          size?: number;
          value?: string;
        }
      | {
          type: 'submit';
          formaction?: string;
          formenctype?: string;
          formmethod?: string;
          formnovalidate?: boolean;
          formtarget?: string;
          value?: string;
        }
      | {
          type: 'tel';
          dirname?: string;
          list?: string;
          maxlength?: number;
          minlength?: number;
          pattern?: string;
          placeholder?: string;
          required?: boolean;
          size?: number;
          value?: string;
        }
      | {
          type: 'text';
          dirname?: string;
          list?: string;
          maxlength?: number;
          minlength?: number;
          pattern?: string;
          placeholder?: string;
          readonly?: boolean;
          required?: boolean;
          size?: number;
          value?: string;
        }
      | {
          type: 'time';
          list?: string;
          max?: string;
          min?: string;
          readonly?: boolean;
          required?: boolean;
          step?: number;
          value?: string;
        }
      | {
          type: 'url';
          dirname?: string;
          list?: string;
          maxlength?: number;
          minlength?: number;
          pattern?: string;
          placeholder?: string;
          required?: boolean;
          size?: number;
          value?: string;
        }
    );

  type ReferrerPolicy =
    | ''
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';

  export type IntrinsicElements = {
    a: ParentAttributes<HTMLAnchorElement> & {
      download?: string;
      href?: string;
      hreflang?: string;
      ping?: string;
      referrerpolicy?: ReferrerPolicy;
      rel?: string;
      target?: string;
      type?: string;
    };
    abbr: ParentAttributes<HTMLElement>;
    address: ParentAttributes<HTMLElement>;
    area: GlobalAttributes<HTMLAreaElement> & {
      alt?: string;
      coords?: string;
      download?: string;
      href?: string;
      ping?: string;
      referrerpolicy?: ReferrerPolicy;
      rel?: string;
      shape?: string;
      target?: string;
    };
    article: ParentAttributes<HTMLElement>;
    aside: ParentAttributes<HTMLElement>;
    audio: ParentAttributes<HTMLAudioElement> & {
      autoplay?: boolean;
      controls?: boolean;
      crossorigin?: string;
      loop?: boolean;
      muted?: boolean;
      preload?: string;
      src?: string;

      oncanplay?: (this: HTMLAudioElement, ev: Event) => void;
      oncanplaythrough?: (this: HTMLAudioElement, ev: Event) => void;
      oncomplete?: (this: HTMLAudioElement, ev: Event) => void;
      ondurationchange?: (this: HTMLAudioElement, ev: Event) => void;
      onemptied?: (this: HTMLAudioElement, ev: Event) => void;
      onended?: (this: HTMLAudioElement, ev: Event) => void;
      onloadeddata?: (this: HTMLAudioElement, ev: Event) => void;
      onloadedmetadata?: (this: HTMLAudioElement, ev: Event) => void;
      onpause?: (this: HTMLAudioElement, ev: Event) => void;
      onplay?: (this: HTMLAudioElement, ev: Event) => void;
      onplaying?: (this: HTMLAudioElement, ev: Event) => void;
      onprogress?: (this: HTMLAudioElement, ev: ProgressEvent<EventTarget>) => void;
      onratechange?: (this: HTMLAudioElement, ev: Event) => void;
      onseeked?: (this: HTMLAudioElement, ev: Event) => void;
      onseeking?: (this: HTMLAudioElement, ev: Event) => void;
      onstalled?: (this: HTMLAudioElement, ev: Event) => void;
      onsuspend?: (this: HTMLAudioElement, ev: Event) => void;
      ontimeupdate?: (this: HTMLAudioElement, ev: Event) => void;
      onvolumechange?: (this: HTMLAudioElement, ev: Event) => void;
      onwaiting?: (this: HTMLAudioElement, ev: Event) => void;
    };
    b: ParentAttributes<HTMLElement>;
    base: GlobalAttributes<HTMLBaseElement> & {
      href?: string;
      target?: string;
    };
    bdi: ParentAttributes<HTMLElement>;
    bdo: ParentAttributes<HTMLElement> & {
      dir?: 'ltr' | 'rtl' | 'auto';
    };
    blockquote: ParentAttributes<HTMLQuoteElement> & {
      cite?: string;
    };
    body: ParentAttributes<HTMLBodyElement>;
    br: GlobalAttributes<HTMLBRElement>;
    button: ParentAttributes<HTMLButtonElement> & {
      autofocus?: boolean;
      disabled?: boolean;
      form?: string;
      formaction?: string;
      formenctype?: string;
      formmethod?: string;
      formnovalidate?: boolean;
      formtarget?: string;
      name?: string;
      type?: 'button' | 'submit' | 'reset';
      value?: string;
    };
    canvas: ParentAttributes<HTMLCanvasElement> & {
      height?: number | string;
      width?: number | string;
    };
    caption: ParentAttributes<HTMLTableCaptionElement>;
    cite: ParentAttributes<HTMLElement>;
    code: ParentAttributes<HTMLElement>;
    col: GlobalAttributes<HTMLTableColElement> & {
      span?: number;
    };
    colgroup: GlobalAttributes<HTMLTableColElement> &
      (
        | {
            span?: number;
          }
        | { children?: HTMLTableColElement[] | HTMLTableColElement | null | undefined }
      );
    data: ParentAttributes<HTMLDataElement> & {
      value?: string;
    };
    datalist: ParentAttributes<HTMLDataListElement>;
    dd: ParentAttributes<HTMLElement>;
    del: ParentAttributes<HTMLModElement> & {
      cite?: string;
      datetime?: string;
    };
    details: ParentAttributes<HTMLDetailsElement> & {
      open?: boolean;
      name?: string;
    };
    dfn: ParentAttributes<HTMLElement>;
    dialog: ParentAttributes<HTMLDialogElement> & {
      open?: boolean;
      closedby?: 'any' | 'closerequest' | 'none';
    };
    div: ParentAttributes<HTMLDivElement>;
    dl: ParentAttributes<HTMLDListElement>;
    dt: ParentAttributes<HTMLElement>;
    em: ParentAttributes<HTMLElement>;
    fieldset: ParentAttributes<HTMLFieldSetElement> & {
      disabled?: boolean;
      form?: string;
      name?: string;
    };
    figcaption: ParentAttributes<HTMLElement>;
    figure: ParentAttributes<HTMLElement>;
    footer: ParentAttributes<HTMLElement>;
    form: ParentAttributes<HTMLFormElement> & {
      acceptCharset?: string;
      action?: string;
      autocomplete?: 'on' | 'off';
      name?: string;
      rel?: string;
      enctype?: string;
      method?: 'get' | 'post';
      noValidate?: boolean;
      target?: string;
    };
    h1: ParentAttributes<HTMLHeadingElement>;
    h2: ParentAttributes<HTMLHeadingElement>;
    h3: ParentAttributes<HTMLHeadingElement>;
    h4: ParentAttributes<HTMLHeadingElement>;
    h5: ParentAttributes<HTMLHeadingElement>;
    h6: ParentAttributes<HTMLHeadingElement>;
    head: ParentAttributes<HTMLHeadElement>;
    header: ParentAttributes<HTMLElement>;
    hgroup: ParentAttributes<HTMLElement>;
    hr: GlobalAttributes<HTMLHRElement>;
    html: ParentAttributes<HTMLHtmlElement> & {
      manifest?: string;
      lang?: string;
    };
    i: ParentAttributes<HTMLElement>;
    iframe: GlobalAttributes<HTMLIFrameElement> & {
      allow?: string;
      allowFullscreen?: boolean;
      height?: number | string;
      loading?: 'eager' | 'lazy';
      name?: string;
      referrerpolicy?: ReferrerPolicy;
      sandbox?: string;
      src?: string;
      srcdoc?: string;
      width?: number | string;
    };
    img: GlobalAttributes<HTMLImageElement> & {
      alt?: string;
      crossorigin?: string;
      height?: number | string;
      ismap?: boolean;
      loading?: 'eager' | 'lazy';
      referrerpolicy?: ReferrerPolicy;
      sizes?: string;
      src?: string;
      srcset?: string;
      usemap?: string;
      width?: number | string;
    };
    input: InputAttributes;
    ins: ParentAttributes<HTMLModElement> & {
      cite?: string;
      datetime?: string;
    };
    kbd: ParentAttributes<HTMLElement>;
    label: ParentAttributes<HTMLLabelElement> & {
      for?: string;
    };
    legend: ParentAttributes<HTMLLegendElement>;
    li: ParentAttributes<HTMLLIElement> & {
      value?: number;
    };
    link: GlobalAttributes<HTMLLinkElement> & {
      as?:
        | 'audioworklet'
        | 'fetch'
        | 'font'
        | 'image'
        | 'json'
        | 'paintworklet'
        | 'script'
        | 'serviceworker'
        | 'sharedworker'
        | 'style'
        | 'text'
        | 'track'
        | 'worker';
      blocking?: 'render';
      crossorigin?: string;
      disabled?: boolean;
      fetchpriority?: 'high' | 'low' | 'auto';
      href?: string;
      hreflang?: string;
      imagesizes?: string;
      imagesrcset?: string;
      integrity?: string;
      media?: string;
      referrerpolicy?: ReferrerPolicy;
      rel?: string;
      sizes?: string;
      title?: string;
      type?: string;
    };
    main: ParentAttributes<HTMLElement>;
    map: ParentAttributes<HTMLMapElement> & {
      name?: string;
    };
    mark: ParentAttributes<HTMLElement>;
    menu: ParentAttributes<HTMLMenuElement>;
    meta: ParentAttributes<HTMLMetaElement> & {
      charset?: string;
      content?: string;
      httpEquiv?: string;
      media?: string;
      name?: string;
    };
    meter: ParentAttributes<HTMLMeterElement> & {
      value?: number;
      min?: number;
      max?: number;
      low?: number;
      high?: number;
      optimum?: number;
    };
    nav: ParentAttributes<HTMLElement>;
    noscript: ParentAttributes<HTMLElement>;
    object: ParentAttributes<HTMLObjectElement> & {
      data?: string;
      form?: string;
      height?: number | string;
      name?: string;
      type?: string;
      width?: number | string;
    };
    ol: ParentAttributes<HTMLOListElement> & {
      reversed?: boolean;
      start?: number;
      type?: '1' | 'A' | 'a' | 'I' | 'i';
    };
    optgroup: ParentAttributes<HTMLOptGroupElement> & {
      disabled?: boolean;
      label?: string;
    };
    option: GlobalAttributes<HTMLOptionElement> & {
      disabled?: boolean;
      label?: string;
      selected?: boolean;
      value?: string;
      children?: string | null | undefined;
    };
    output: ParentAttributes<HTMLOutputElement> & {
      for?: string;
      form?: string;
      name?: string;
    };
    p: ParentAttributes<HTMLParagraphElement>;
    picture: ParentAttributes<HTMLPictureElement>;
    pre: ParentAttributes<HTMLPreElement>;
    progress: ParentAttributes<HTMLProgressElement> & {
      value?: number;
      max?: number;
    };
    q: ParentAttributes<HTMLQuoteElement> & {
      cite?: string;
    };
    rp: GlobalAttributes<HTMLElement> & {
      children?: string | null | undefined;
    };
    rt: ParentAttributes<HTMLElement>;
    ruby: ParentAttributes<HTMLElement>;
    s: ParentAttributes<HTMLElement>;
    samp: ParentAttributes<HTMLElement>;
    script: GlobalAttributes<HTMLScriptElement> & {
      async?: boolean;
      blocking?: 'render';
      crossorigin?: string;
      defer?: boolean;
      fetchpriority?: 'high' | 'low' | 'auto';
      integrity?: string;
      nomodule?: boolean;
      nonce?: string;
      referrerpolicy?: ReferrerPolicy;
      src?: string;
      type?: string;
      children?: string;
    };
    search: ParentAttributes<HTMLElement>;
    section: ParentAttributes<HTMLElement>;
    select: ParentAttributes<HTMLSelectElement> & {
      autofocus?: boolean;
      disabled?: boolean;
      form?: string;
      multiple?: boolean;
      name?: string;
      required?: boolean;
      size?: number;
    };
    slot: ParentAttributes<HTMLSlotElement> & {
      name?: string;
      onslotchange?: (this: HTMLSlotElement, ev: Event) => void;
    };
    small: ParentAttributes<HTMLElement>;
    source: GlobalAttributes<HTMLSourceElement> & {
      media?: string;
      sizes?: string;
      src?: string;
      srcset?: string;
      type?: string;
      height?: number;
      width?: number;
    };
    span: ParentAttributes<HTMLSpanElement>;
    strong: ParentAttributes<HTMLElement>;
    style: GlobalAttributes<HTMLStyleElement> & {
      blocking?: 'render';
      media?: string;
      nonce?: string;
      title?: string;
      children?: string;
    };
    sub: ParentAttributes<HTMLElement>;
    summary: ParentAttributes<HTMLElement>;
    sup: ParentAttributes<HTMLElement>;
    table: ParentAttributes<HTMLTableElement>;
    tbody: ParentAttributes<HTMLTableSectionElement>;
    td: ParentAttributes<HTMLTableCellElement> & {
      colspan?: number;
      headers?: string;
      rowspan?: number;
    };
    template: ParentAttributes<HTMLTemplateElement> & {
      shadowrootmode?: 'open' | 'closed';
      shadowrootclonable?: boolean;
      shadowrootcustomelementregistry?: boolean;
      shadowrootdelegatesfocus?: boolean;
      shadowrootserializable?: boolean;
    };
    textarea: GlobalAttributes<HTMLTextAreaElement> & {
      autofocus?: boolean;
      cols?: number;
      dirname?: string;
      disabled?: boolean;
      form?: string;
      maxlength?: number;
      minlength?: number;
      name?: string;
      placeholder?: string;
      readonly?: boolean;
      required?: boolean;
      rows?: number;
      spellcheck?: 'true' | 'default' | 'false';
      wrap?: 'hard' | 'soft' | 'off';
      children?: string | null | undefined;
    };
    tfoot: ParentAttributes<HTMLTableSectionElement>;
    th: ParentAttributes<HTMLTableCellElement> & {
      abbr?: string;
      colspan?: number;
      headers?: string;
      rowspan?: number;
      scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
    };
    thead: ParentAttributes<HTMLTableSectionElement>;
    time: ParentAttributes<HTMLTimeElement> & {
      datetime?: string;
    };
    title: GlobalAttributes<HTMLTitleElement> & {
      children?: string | null | undefined;
    };
    tr: ParentAttributes<HTMLTableRowElement>;
    track: GlobalAttributes<HTMLTrackElement> & {
      default?: boolean;
      kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
      label?: string;
      src?: string;
      srclang?: string;
    };
    u: ParentAttributes<HTMLElement>;
    ul: ParentAttributes<HTMLUListElement>;
    var: ParentAttributes<HTMLElement>;
    video: ParentAttributes<HTMLVideoElement> & {
      autoplay?: boolean;
      controls?: boolean;
      controlslist?: string;
      crossorigin?: 'anonymous' | 'use-credentials';
      disablepictureinpicture?: boolean;
      disableremoteplayback?: boolean;
      height?: number | string;
      loop?: boolean;
      muted?: boolean;
      playsinline?: boolean;
      poster?: string;
      preload?: 'auto' | 'metadata' | 'none';
      src?: string;
      width?: number;

      oncanplay?: (this: HTMLVideoElement, ev: Event) => void;
      oncanplaythrough?: (this: HTMLVideoElement, ev: Event) => void;
      oncomplete?: (this: HTMLVideoElement, ev: Event) => void;
      ondurationchange?: (this: HTMLVideoElement, ev: Event) => void;
      onemptied?: (this: HTMLVideoElement, ev: Event) => void;
      onended?: (this: HTMLVideoElement, ev: Event) => void;
      onloadeddata?: (this: HTMLVideoElement, ev: Event) => void;
      onloadedmetadata?: (this: HTMLVideoElement, ev: Event) => void;
      onpause?: (this: HTMLVideoElement, ev: Event) => void;
      onplay?: (this: HTMLVideoElement, ev: Event) => void;
      onplaying?: (this: HTMLVideoElement, ev: Event) => void;
      onprogress?: (this: HTMLVideoElement, ev: ProgressEvent<EventTarget>) => void;
      onratechange?: (this: HTMLVideoElement, ev: Event) => void;
      onseeked?: (this: HTMLVideoElement, ev: Event) => void;
      onseeking?: (this: HTMLVideoElement, ev: Event) => void;
      onstalled?: (this: HTMLVideoElement, ev: Event) => void;
      onsuspend?: (this: HTMLVideoElement, ev: Event) => void;
      ontimeupdate?: (this: HTMLVideoElement, ev: Event) => void;
      onvolumechange?: (this: HTMLVideoElement, ev: Event) => void;
      onwaiting?: (this: HTMLVideoElement, ev: Event) => void;
    };
    wbr: GlobalAttributes<HTMLElement>;
    svg: ParentAttributes<SVGSVGElement> & {
      height?: number | string;
      width?: number | string;
      viewBox?: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: number | string;
    };
    g: ParentAttributes<SVGGElement> & {
      transform?: string;
    };
    path: ParentAttributes<SVGPathElement> & {
      d?: string;
      fill?: string;
    };
  };

  export interface ElementChildrenAttribute {
    children: unknown;
  }

  export type ComponentProps = Record<string, unknown>;
  export type Component = (props: ComponentProps) => Element | null;
}

export const SVG_NS = 'http://www.w3.org/2000/svg';
export const SVG_ELEMENTS = {
  svg: 'svg',
  path: 'path',
  g: 'g',
};
