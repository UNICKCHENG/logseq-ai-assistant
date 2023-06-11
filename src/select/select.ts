import '@logseq/libs';
import { getSettings }  from '@/libs/settings';

// https://docs.logseq.com/#/page/advanced%20queries
// https://bgrolleman.gitlab.io/logseq_publish_toolsontech/#/page/logseq%2Fadvanced%20queries
// https://mschmidtkorth.github.io/logseq-msk-docs/#/page/queries%2Fadvanced%20queries
// https://qwxlea.github.io/#/page/datalog%2Fintro%20to%20datalog
// http://cljs.github.io/api/clojure.string/

// https://github.com/logseq/logseq-plugin-samples/tree/master/logseq-a-translator

const queryTemplate = (content: string) => {
    return `[
        :find (pull ?b [*]) 
        :where [?b :block/content ?t] 
               [(clojure.string/includes? ?t \"${content}\")] ]` as string; 
}

const query = async(content: string) => {
    let text = content.replace(/"/g, '');
    if (undefined === text || '' === text.trim()) {
        return [];
    }
    return await logseq.DB.datascriptQuery(
        queryTemplate(text)
    );
}

const templateHtml = async(json: any, block_id: string, content: string) => {
    let html: string = `<div style="height: 300px; overflow: auto;"><table><tbody">`;
    for (let text of json) {
        if (block_id == text[0].uuid) {
            continue;
        }

        let num: number = 12;
        let te: string = text[0].content.replaceAll('\n', '');
        let page_name: string = (await logseq.Editor.getPage(text[0].page.id))?.name || 'logseq';
        let len: number = text.length;
        let pos: number = te.indexOf(content);
        let start_pos: number = (pos - num < 0 || len < 3 * num) ? 0 : pos - num;
        let output: string = JSON.stringify(te.substring(start_pos));
        html += `
        <tr class="row">
        <div><pre> ${output}</pre></div>
        <div style="text-align: right"> ${page_name} </div>
        </tr>
        `;
    }
    html += `</tbody></table></div>`;
    return html;
}

export async function select (): Promise<void> {
    await logseq.Editor.onInputSelectionEnd(async(e) => {
        if(!(await getSettings()).isTextQuery) {
            return;
        }

        const { x, y } = e.point;
        const dsl = (template: string) => {
            return {
                key: 'selection-end-text-dialog',
                close: 'outside',
                template: template,
                style: {
                    left: x + 'px',
                    top: y + 'px',
                    width: '500px',
                    backgroundColor: 'var(--ls-secondary-background-color)',
                    color: 'var(--ls-primary-text-color)',
                },
                attrs: {
                    title: 'Text Query',
                },
            }
        }

        try {
            // logseq.provideUI(dsl('Loading...'));
            const result: any = await query(e.text);
            let { uuid: block_id }: any = await logseq.Editor.getCurrentBlock();
            await logseq.provideUI(dsl(await templateHtml(result, block_id, e.text)));
        } catch(err: any) {
            await logseq.UI.showMsg(err.message);
        }
    });
}
