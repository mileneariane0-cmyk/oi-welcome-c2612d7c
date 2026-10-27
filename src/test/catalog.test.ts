import {describe,it,expect} from 'vitest';
import {birthdaysToday,variantGroups,selectedPrice} from '@/lib/catalog';
import {addBagEntry} from '@/lib/bag';
describe('catalog rules',()=>{
 it('uses Bahia date before UTC midnight rolls over locally',()=>{expect(birthdaysToday([{birth_date:'1990-10-25'},{birth_date:'1990-10-26'},{birth_date:null}],new Date('2026-10-26T02:30:00Z'))).toEqual([{birth_date:'1990-10-25'}]);});
 it('does not require options for a product without variants',()=>{expect(variantGroups([])).toEqual([]);});
 it('keeps optional groups optional',()=>{expect(variantGroups([{id:'1',name:'Sem música',price:null,attributes:{group:'Música',required:false}}])[0]?.required).toBe(false);});
 it('uses option final price and preserves base for no priced selection',()=>{const variants=[{id:'a',name:'Grande',price:59.9,attributes:{group:'Tamanho'}}];expect(selectedPrice(49.9,variants,{Tamanho:'a'})).toBe(59.9);expect(selectedPrice(49.9,variants,{})).toBe(49.9);});
 it('retains each option and personalization separately in the bag',()=>{const first=addBagEntry([],'p',2,{Tamanho:'a'},'Maria');const next=addBagEntry(first,'p',1,{Tamanho:'b'},'Ana');expect(next).toHaveLength(2);expect(next[0]?.selected).toEqual({Tamanho:'a'});expect(next[0]?.quantity).toBe(2);expect(next[1]?.personalization).toBe('Ana');});
});