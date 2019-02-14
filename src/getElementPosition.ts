/* tslint:disable: no-console ordered-imports object-literal-sort-keys */

/* ---------------------------------
    エレメントの位置を取得
---------------------------------- */
// http://phiary.me/javascript-get-bounding-client-rect-absolute-position/
const getElementPosition = (elementId: string, dx: number,dy: number) => {
    const element = document.getElementById(elementId) !== null ? document.getElementById(elementId) : null;
    if (element === null) {
        return;
    } else {
        const rect = element.getBoundingClientRect();
        return {left: (rect.left + dx) + "px", top: (rect.top + dy) + "px"}
    }
}

export default getElementPosition;