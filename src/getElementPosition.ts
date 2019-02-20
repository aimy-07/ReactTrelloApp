/* ---------------------------------
    エレメントの位置を取得
---------------------------------- */
// http://phiary.me/javascript-get-bounding-client-rect-absolute-position/
const getElementPosition = (elementId: string, dx: number, dy: number) => {
    const element = document.getElementById(elementId) !== null ? document.getElementById(elementId) : null;
    if (element !== null) {
        const rect = element.getBoundingClientRect();
        return { left: (rect.left + dx) + 'px', top: (rect.top + dy) + 'px' };
    }
    return { left: '0px', top: '0px' };
};

export default getElementPosition;
