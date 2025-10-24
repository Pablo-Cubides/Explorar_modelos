'use client'
import React from 'react'

type ReferenceLink = {
  title: string
  url: string
  source: string
  icon?: string
}

type Props = {
  links: ReferenceLink[]
  compact?: boolean
}

export default function AcademicReferences({ links, compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full glass-hover border border-primary/20 hover:border-primary/50 transition-all duration-300 group"
            title={link.title}
          >
            <span className="text-primary group-hover:text-secondary transition-colors">
              {link.icon || '📚'}
            </span>
            <span className="text-gray-400 group-hover:text-white transition-colors">
              {link.source}
            </span>
            <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="flex items-start gap-3 p-3 rounded-xl glass-hover border border-white/5 hover:border-primary/30 transition-all duration-300 group"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-cyber/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            {link.icon || '📄'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors">
                {link.source}
              </span>
              <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-1">
              {link.title}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
