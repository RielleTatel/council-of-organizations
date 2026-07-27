import type { ThreadColor } from '../lib/assets'

export interface OfficeMeta {
  name: string
  description: string
  color: ThreadColor
}

export const offices: OfficeMeta[] = [
  {
    name: 'Office of the Chairperson',
    description:
      "The Office of the Chairperson leads the Council, represents COA-Z to the university and external bodies, and sets the direction of the Council's programs and advocacies.",
    color: 'red',
  },
  {
    name: 'Office of the Secretary-General',
    description:
      'The Office of the Secretary-General oversees internal records, institutional memory, and the transparency functions that keep the Council accountable to its member organizations.',
    color: 'purple',
  },
  {
    name: 'Office of Communications',
    description:
      'The Office of Communications manages how COA-Z reaches and engages its constituents, from social media to content strategy.',
    color: 'yellow',
  },
  {
    name: 'Office of Creatives and Branding',
    description:
      "The Office of Creatives and Branding shapes the visual identity of COA-Z and documents the Council's events and milestones.",
    color: 'pink',
  },
  {
    name: 'Office of Finance',
    description:
      'The Office of Finance ensures the fiscal integrity of the Council, managing funds and supporting the financial needs of member organizations.',
    color: 'green',
  },
]

export const buklodCommittee = {
  title: 'Buklod Atenista Envoy Committee',
  description:
    'The Buklod Atenista Envoy Committee represents COA-Z in the national Buklod Atenista network, composed of the Chairperson and other key officers as appointed by the Chairperson.',
}
