import React from "react";

const Icons = ({
  type,
  ...props
}: {
  type: string;
  [key: string]: unknown;
}) => {
  switch (type) {
    case "logo":
      return (
        <svg viewBox="0 0 150 73" {...props}>
          <path
            fill={(props.fill as string) || "#fff"}
            fill-rule="evenodd"
            d="M146.001 58.599H86.693l-1.201-4.906H72.294c-.588 2.456-.749 3.042-1.371 4.906H18.642V19.518h20.227v25.716h4.8c3.659 0 8.011-.005 11.096-.005 2.742-8.515 5.531-17.197 8.273-25.711h31.711c0 .056 7.49 22.767 9.428 28.591 5.153-4.824 15.256-14.323 15.256-14.38h-15.428V19.518h41.996v12.181c-2.081 1.709-16.284 13.93-16.284 14.042h16.284v12.858ZM78.979 28.991c-.115 0-3.869 12.439-4.285 13.874h8.399l-4.114-13.874ZM5.277 27.559c.092 4.757 5.631 12.813 10.263 15.428C.986 37.456-.413 28.657.083 23.873 1.424 10.915 26.48-.007 60.064-.007c25.692 0 41.411 1.137 63.872 9.474C98.856 1.13 4.698-2.277 5.277 27.559Zm70.446 38.69c0 2.922-4.163 2.882-7.086 2.84v1.867c-1.151 0-2.554.003-3.885-.006v-7.614h6.513c1.111 0 4.458-.165 4.458 2.913Zm-7.076-.752v1.522c.743 0 2.571.155 2.571-.712 0-.963-1.646-.812-2.571-.81Zm17.36-2.161c.344.846 2.032 5.362 2.742 7.614h-4.284l-.344-1.015h-3.085l-.342 1.015h-4.287c1.693-4.738 2.18-6.044 2.744-7.614h6.856Zm-2.571 4.568c-.541-1.413-.541-1.413-.944-2.537-.354 1.304-.292 1.124-.77 2.537h1.714Zm15.256.338c.564.559 1.747 1.895 2.57 2.708h-4.799l-2.228-2.199v2.23c-1.275 0-2.848-.031-4.285-.031v-7.614h6.856c6 0 4.547 4.906 1.886 4.906Zm-4.457-2.875v1.522c.743 0 2.571.155 2.571-.712 0-.963-1.646-.812-2.571-.81Zm12.855.677c1.218-1.378 1.337-1.514 2.229-2.708h4.971c0 .057-2.518 3.287-3.257 4.23.372.366 2.515 2.82 3.086 3.384h-4.628c-.814-.803-1.563-1.544-2.401-2.368v2.368h-4.284v-7.614h4.284v2.708Zm13.028 4.888c-1.331-.011-2.685.018-4.285.018v-7.614h4.285v7.596Zm9.085-4.55v-3.046h3.943v7.614h-3.771c-1.417-1.449-1.461-1.534-3.257-3.384v3.384h-3.943v-7.614h4.285a590.815 590.815 0 0 1 2.743 3.046Zm16.456-2.876v2.538c-1.315-.056-2.628-.003-3.944-.06-3.707 0-3.036 3.274-1.541 3.274h1.714v-2.03h3.943v3.214c-1.797.347-4.145.688-6.857.508-5.828-.499-6.723-9.181 6.685-7.444Z"
          />
        </svg>
      );

    default:
      return null;
  }
};

export default Icons;
