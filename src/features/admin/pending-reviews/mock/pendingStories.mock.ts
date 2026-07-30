/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SacredStory } from '../types';

export const INITIAL_PENDING_STORIES: SacredStory[] = [
  {
    id: 'st-perpetua',
    sacredName: 'Saint Vibia Perpetua',
    devotionalCategory: 'Early Christian Martyr',
    canonizationYear: 'Pre-Congregation',
    definingUtterance: 'Stand fast in the faith, and love one another, and be not offended at our sufferings.',
    veneratedNarrative: 'A young noblewoman of Carthage, Vibia Perpetua kept a diary recording her arrest, imprisonment, and visions leading up to her martyrdom in the arena. Her chronicle, completed by an eyewitness, represents one of the earliest extant texts written by a Christian woman. Alongside her slave Felicity, she refused to recant her faith, embodying courageous devotion that galvanized the early North African church and inspired generations of believers.',
    accessControl: {
      publicArchive: true,
      liturgicalCalendarTag: 'March 7'
    },
    burialPlace: {
      sanctuaryName: 'Basilica Major of Carthage',
      physicalAddress: 'Carthage Archaeological Site, Tunis, Tunisia',
      latitude: '36.8528',
      longitude: '10.3333',
      siteTypology: 'Ancient Basilica Ruins',
      translationDate: 'Unknown (Archaeological Site)',
      description: 'The historical basilica where the martyrs Vibia Perpetua and Felicity were buried. Today, the ruins stand as a silent testament to the ancient Christian heritage of Carthage.'
    },
    chronology: [
      {
        id: 'ev-p1',
        year: '181 AD',
        eventTitle: 'Noble Birth in Carthage',
        description: 'Born to wealthy patrician family in Carthage, Roman North Africa.'
      },
      {
        id: 'ev-p2',
        year: '203 AD',
        eventTitle: 'Arrest & Imprisonment',
        description: 'Detained under the edict of Emperor Septimius Severus for refusing to sacrifice to the pagan gods.'
      }
    ],
    gallery: [
      {
        id: 'gal-p1',
        title: 'Carthage Amphitheater Ruins',
        imageUrl: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&q=80&w=400',
        category: 'Sanctuary'
      }
    ],
    documentaryMedia: {
      title: 'Chronicles of Carthage',
      duration: '06:15',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    status: 'Pending',
    submittedBy: 'Scribe Perpetua',
    dateSubmitted: '2026-07-20',
    editorialComments: 'Urgent review required. The biography text needs editorial polish. Cross-check Carthaginian municipal records.',
    editorialChecks: {
      authenticityVerified: true,
      historicalCorroboration: false,
      accessPermissionsChecked: true,
      relicVenerationDocumented: false
    }
  },
  {
    id: 'st-maxim',
    sacredName: 'Father Maxim of Altai',
    devotionalCategory: 'Missionary Priest',
    canonizationYear: '1904 AD',
    definingUtterance: 'In the silence of the mountains, the creator\'s voice is the loudest wind.',
    veneratedNarrative: 'A humble priest who traveled to the remote Altai mountains, establishing missions and translating liturgical texts into indigenous Siberian dialects. His life of simplicity, prayer, and deep respect for local cultures won the hearts of the Siberian peoples, establishing a legacy of enduring Orthodox presence in the East.',
    accessControl: {
      publicArchive: true,
      liturgicalCalendarTag: 'August 12'
    },
    burialPlace: {
      sanctuaryName: 'Altai Mountain Hermitage',
      physicalAddress: 'Altai Republic, Russian Federation',
      latitude: '50.9167',
      longitude: '86.9167',
      siteTypology: 'Wooden Hermitage Crypt',
      translationDate: 'August 12, 1912 AD',
      description: 'A remote wooden chapel in the heart of the Altai mountains where Father Maxim lived his final years in contemplation.'
    },
    chronology: [
      {
        id: 'ev-m1',
        year: '1845 AD',
        eventTitle: 'Ordination in St. Petersburg',
        description: 'Consecrated into the priesthood after brilliant theological studies.'
      }
    ],
    gallery: [],
    documentaryMedia: {
      title: 'Apostle of the Altai',
      duration: '10:45',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    status: 'Pending',
    submittedBy: 'Brother Elias',
    dateSubmitted: '2026-07-24',
    editorialComments: 'Lacks documented miracle reports for full verification. Historical records of the diocese are complete.',
    editorialChecks: {
      authenticityVerified: false,
      historicalCorroboration: true,
      accessPermissionsChecked: true,
      relicVenerationDocumented: false
    }
  }
];
