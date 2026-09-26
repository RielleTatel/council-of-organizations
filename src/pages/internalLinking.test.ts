import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { singletonDefaults } from '../lib/cms/bootstrap'

function expectLink(page:string,copy:Record<string,string>,destination:string){
  const source=readFileSync(resolve(__dirname,`${page}.tsx`),'utf8')
  const field=Object.entries(copy).find(([key,value])=>key.startsWith('link')&&value===destination)?.[0]
  expect(field).toBeDefined()
  expect(source).toContain(`to={copy.${field}}`)
}
describe('initial public internal links',()=>{
  it('Leadership links to Organizations',()=>expectLink('Leadership',singletonDefaults.leadership.copy.Leadership,'/organizations'))
  it('About links to Leadership',()=>expectLink('About',singletonDefaults.about.copy.About,'/leadership'))
  it('RecWeek links to Organizations',()=>expectLink('RecWeek',singletonDefaults.recweek.copy.RecWeek,'/organizations'))
})
