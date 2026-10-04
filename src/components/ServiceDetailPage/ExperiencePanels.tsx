'use client'

import { useState } from 'react'
import type { ServiceContent } from '@/data/services'
import styles from './ExperiencePanels.module.css'

export function DecisionLab({ kind }: { kind: ServiceContent['id'] }) {
  const [alternate, setAlternate] = useState(false)
  const [approved, setApproved] = useState(false)
  const labels =
    kind === 'web'
      ? ['Desktop', 'Mobile']
      : kind === 'software'
        ? ['Team member', 'Approver']
        : ['Complete enquiry', 'Missing details']
  return (
    <div className={styles.lab} data-decision-lab={kind}>
      <noscript>
        <style>{`[data-decision-lab] button { display: none; }`}</style>
      </noscript>
      <div className={styles.labBar}>
        <span>Try a design decision</span>
        <span>Illustrative</span>
      </div>
      <div className={styles.switches}>
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={alternate === Boolean(i)}
            onClick={() => {
              setAlternate(Boolean(i))
              setApproved(false)
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.labStage}>
        {kind === 'web' ? (
          <div key={String(alternate)} className={styles.viewport} data-mobile={alternate}>
            <span className={styles.tiny}>
              STUDIO / HOME <span>{alternate ? '☰' : 'Work    About    Contact'}</span>
            </span>
            <div className={styles.siteContent}>
              <strong>
                Made for
                <br />
                <em>your next move.</em>
              </strong>
              <p>A clear story. An obvious next step.</p>
              <span className={styles.mockAction}>Start a conversation ↗</span>
            </div>
            <div className={styles.siteGrid}>
              <i />
              <i />
              <i />
            </div>
          </div>
        ) : kind === 'software' ? (
          <div className={styles.permission}>
            <span className={styles.tiny}>REQUEST / SUPPLIER ONBOARDING</span>
            <h3>Ready for a decision.</h3>
            <dl>
              <div>
                <dt>Business details</dt>
                <dd>Verified ✓</dd>
              </div>
              <div>
                <dt>Required documents</dt>
                <dd>Complete ✓</dd>
              </div>
              <div>
                <dt>Your role</dt>
                <dd>{alternate ? 'Approver' : 'Team member'}</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled={!alternate || approved}
              onClick={() => setApproved(true)}
            >
              {approved
                ? 'Approved and recorded ✓'
                : alternate
                  ? 'Approve sample request →'
                  : 'Approval requires an approver'}
            </button>
            <p aria-live="polite">
              {approved
                ? 'The decision is recorded. Your team can see what happened.'
                : alternate
                  ? 'The right role can take the next action.'
                  : 'The request is visible. The decision belongs to an authorized reviewer.'}
            </p>
          </div>
        ) : (
          <div className={styles.routing}>
            <div className={styles.source}>
              <span className={styles.tiny}>INCOMING ENQUIRY</span>
              <p>
                {alternate
                  ? '“Can you help us with a project?”'
                  : '“We need a customer portal. Please contact our operations team.”'}
              </p>
            </div>
            <span className={styles.routeArrow}>↓</span>
            <span className={styles.rule}>Required information check</span>
            <div className={styles.fork}>
              <div data-active={!alternate}>
                <small>COMPLETE</small>
                <strong>Route to the team</strong>
                <p>Prepare a record for review.</p>
              </div>
              <div data-active={alternate}>
                <small>INCOMPLETE</small>
                <strong>Ask for clarity</strong>
                <p>A person confirms what is needed.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className={styles.labCaption}>
        {kind === 'web'
          ? 'Change the screen. The important action stays in view.'
          : kind === 'software'
            ? 'Change the role. See who can approve the same request.'
            : 'Change the input. See the exception take a different path.'}
      </p>
    </div>
  )
}

export function DeliveryJourney({
  service,
  handover,
}: {
  service: ServiceContent
  handover: string[]
}) {
  const [step, setStep] = useState(0)
  return (
    <div className={styles.journey}>
      <div className={styles.steps} data-delivery-controls>
        {service.process.map((item, i) => (
          <button
            type="button"
            key={item.num}
            aria-pressed={step === i}
            aria-controls="delivery-preview"
            onClick={() => setStep(i)}
          >
            <span>{item.num}</span>
            <strong>{item.title}</strong>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div className={styles.deliveryPreview} id="delivery-preview">
        <div className={styles.deliveryCopy} aria-live="polite">
          <span className={styles.tiny}>STEP 0{step + 1} / 04</span>
          <h3>{service.process[step].title}</h3>
          <p>{service.process[step].body}</p>
          <span className={styles.deliveryNote}>Our advice. Your decision.</span>
        </div>
        <div className={styles.document}>
          <div className={styles.documentBar}>
            <span>IQ / PROJECT WORKSPACE</span>
            <span>Illustrative</span>
          </div>
          {step === 0 ? (
            <>
              <h4>The brief, made clear.</h4>
              <dl className={styles.brief}>
                {[
                  'The business goal',
                  'The people involved',
                  'The current constraint',
                  'The first useful outcome',
                ].map((item, i) => (
                  <div key={item}>
                    <dt>0{i + 1}</dt>
                    <dd>
                      {item}
                      <i />
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : step === 1 ? (
            <>
              <h4>Options, side by side.</h4>
              <div className={styles.plan}>
                {['Option A', 'Option B', 'Option C'].map((item, i) => (
                  <div key={item}>
                    <span>0{i + 1}</span>
                    <strong>{item}</strong>
                    <span>{i === 1 ? 'Our pick' : ''}</span>
                  </div>
                ))}
              </div>
              <div className={styles.feedback}>You choose → we build on it</div>
            </>
          ) : step === 2 ? (
            <>
              <h4>Working progress, visible.</h4>
              <div className={styles.reviewBoard}>
                <div>
                  <span>Build</span>
                  <strong>
                    {service.id === 'web'
                      ? 'Responsive pages'
                      : service.id === 'software'
                        ? 'Core workflow'
                        : 'Connected pilot'}
                  </strong>
                </div>
                <span>→</span>
                <div>
                  <span>Review</span>
                  <strong>Your feedback</strong>
                </div>
              </div>
              <div className={styles.feedback}>Review together → agree the next improvement</div>
            </>
          ) : (
            <>
              <h4>Ready for the next chapter.</h4>
              <ul className={styles.files}>
                {handover.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">▤</span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <noscript>
        <style>{`[data-delivery-controls] { display: none; }`}</style>
        <ol>
          {service.process.map((item) => (
            <li key={item.num}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </noscript>
    </div>
  )
}
