import React, { useState } from 'react';
import { FiArrowRight, FiDownload, FiSun, FiMoon, FiCheck, FiX, FiInfo, FiAlertCircle } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import { Button, Card, Badge, Input, Section, GridLayout, Text } from './components';
import { useTheme } from '../context/ThemeContext';
import { GRADIENTS } from './constants';

export default function ThemeShowcase() {
  const { darkMode, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  
  return (
    <PageTransition>
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <Text variant="h1">Design System</Text>
            <Button 
              variant="outline" 
              onClick={toggleTheme}
              leftIcon={darkMode ? <FiSun /> : <FiMoon />}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>

          {/* Typography */}
          <Section>
            <Text variant="h2" className="mb-6">Typography</Text>
            <div className="space-y-6">
              <div>
                <Text variant="h1">Heading 1</Text>
                <Text variant="muted">text-4xl sm:text-5xl font-bold</Text>
              </div>
              <div>
                <Text variant="h2">Heading 2</Text>
                <Text variant="muted">text-3xl sm:text-4xl font-bold</Text>
              </div>
              <div>
                <Text variant="h3">Heading 3</Text>
                <Text variant="muted">text-2xl sm:text-3xl font-bold</Text>
              </div>
              <div>
                <Text variant="h4">Heading 4</Text>
                <Text variant="muted">text-xl sm:text-2xl font-semibold</Text>
              </div>
              <div>
                <Text variant="h5">Heading 5</Text>
                <Text variant="muted">text-lg sm:text-xl font-semibold</Text>
              </div>
              <div>
                <Text variant="h6">Heading 6</Text>
                <Text variant="muted">text-base sm:text-lg font-semibold</Text>
              </div>
              <div>
                <Text variant="subtitle">Subtitle</Text>
                <Text variant="muted">text-xl font-normal</Text>
              </div>
              <div>
                <Text>Body text</Text>
                <Text variant="muted">text-base font-normal</Text>
              </div>
              <div>
                <Text variant="small">Small text</Text>
                <Text variant="muted">text-sm font-normal</Text>
              </div>
            </div>
          </Section>

          {/* Colors */}
          <Section>
            <Text variant="h2" className="mb-6">Colors</Text>
            
            <Text variant="h4" className="mb-4">Primary</Text>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                <div key={shade} className="flex flex-col">
                  <div 
                    className={`h-24 rounded-lg bg-primary-${shade} flex items-end p-2`}
                  >
                    <Text variant="small" color="white" className="drop-shadow">{shade}</Text>
                  </div>
                  <Text variant="small" className="mt-1">primary-{shade}</Text>
                </div>
              ))}
            </div>

            <Text variant="h4" className="mb-4">Secondary</Text>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                <div key={shade} className="flex flex-col">
                  <div 
                    className={`h-24 rounded-lg bg-secondary-${shade} flex items-end p-2`}
                  >
                    <Text variant="small" color="white" className="drop-shadow">{shade}</Text>
                  </div>
                  <Text variant="small" className="mt-1">secondary-{shade}</Text>
                </div>
              ))}
            </div>

            <Text variant="h4" className="mb-4">Accents</Text>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['blue', 'green', 'yellow', 'purple', 'red'].map(color => (
                <div key={color} className="flex flex-col">
                  <div 
                    className={`h-24 rounded-lg bg-${color} flex items-end p-2`}
                  >
                    <Text variant="small" color="white" className="drop-shadow">{color}</Text>
                  </div>
                  <Text variant="small" className="mt-1">{color}</Text>
                </div>
              ))}
            </div>
          </Section>

          {/* Buttons */}
          <Section>
            <Text variant="h2" className="mb-6">Buttons</Text>
            
            <Text variant="h4" className="mb-4">Variants</Text>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
              <Button variant="dark">Dark</Button>
              <Button variant="light">Light</Button>
            </div>

            <Text variant="h4" className="mb-4">Sizes</Text>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Button variant="primary" size="xs">Extra Small</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="xl">Extra Large</Button>
            </div>

            <Text variant="h4" className="mb-4">With Icons</Text>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" leftIcon={<FiDownload />}>Download</Button>
              <Button variant="outline" rightIcon={<FiArrowRight />}>Learn More</Button>
              <Button variant="ghost" leftIcon={<FiCheck />}>Approve</Button>
              <Button variant="danger" leftIcon={<FiX />}>Delete</Button>
            </div>
          </Section>

          {/* Cards */}
          <Section>
            <Text variant="h2" className="mb-6">Cards</Text>
            
            <GridLayout columns={{ default: 1, md: 3 }} className="mb-10">
              <Card padding="md">
                <Text variant="h5" className="mb-2">Default Card</Text>
                <Text variant="small" color="muted">
                  This is a simple card with default styling and medium padding.
                </Text>
              </Card>

              <Card variant="outlined" padding="md">
                <Text variant="h5" className="mb-2">Outlined Card</Text>
                <Text variant="small" color="muted">
                  This card has a border instead of a shadow.
                </Text>
              </Card>

              <Card variant="elevated" padding="md">
                <Text variant="h5" className="mb-2">Elevated Card</Text>
                <Text variant="small" color="muted">
                  This card has a larger shadow for emphasis.
                </Text>
              </Card>
            </GridLayout>

            <GridLayout columns={{ default: 1, md: 2 }}>
              <Card hasHoverEffect={true} padding="md">
                <Text variant="h5" className="mb-2">Hover Effect</Text>
                <Text variant="small" color="muted" className="mb-4">
                  This card has a hover effect. Try hovering over it!
                </Text>
                <Button variant="outline" size="sm">Learn More</Button>
              </Card>

              <Card variant="glass" padding="md">
                <Text variant="h5" className="mb-2">Glass Card</Text>
                <Text variant="small" color="muted" className="mb-4">
                  This card has a glassmorphism effect with backdrop blur.
                </Text>
                <Button variant="primary" size="sm">See Details</Button>
              </Card>
            </GridLayout>
          </Section>

          {/* Forms */}
          <Section>
            <Text variant="h2" className="mb-6">Forms</Text>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Text variant="h4" className="mb-4">Inputs</Text>
                <div className="space-y-4">
                  <Input
                    id="default-input"
                    label="Default Input"
                    placeholder="Enter some text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  
                  <Input
                    id="required-input"
                    label="Required Input"
                    placeholder="This field is required"
                    isRequired={true}
                  />
                  
                  <Input
                    id="helper-input"
                    label="With Helper Text"
                    placeholder="Enter your email"
                    helperText="We'll never share your email with anyone else."
                  />
                  
                  <Input
                    id="invalid-input"
                    label="Invalid Input"
                    placeholder="user@example.com"
                    isInvalid={true}
                    errorMessage="Please enter a valid email address."
                  />
                  
                  <Input
                    id="disabled-input"
                    label="Disabled Input"
                    placeholder="You cannot edit this"
                    isDisabled={true}
                  />
                </div>
              </div>
              
              <div>
                <Text variant="h4" className="mb-4">Other Form Elements</Text>
                <div className="space-y-4">
                  <div className="form-control">
                    <label htmlFor="select-example" className="label">Select Input</label>
                    <select id="select-example" className="select">
                      <option value="">Select an option</option>
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                      <option value="3">Option 3</option>
                    </select>
                  </div>
                  
                  <div className="form-control">
                    <label htmlFor="textarea-example" className="label">Textarea</label>
                    <textarea id="textarea-example" className="textarea" rows="3" placeholder="Enter a longer message here"></textarea>
                  </div>
                  
                  <div className="form-control">
                    <div className="flex items-center">
                      <input id="checkbox-example" type="checkbox" className="checkbox" />
                      <label htmlFor="checkbox-example" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        I agree to the terms and conditions
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-control">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input id="radio-1" name="radio-group" type="radio" className="radio" />
                        <label htmlFor="radio-1" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                          Option 1
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input id="radio-2" name="radio-group" type="radio" className="radio" />
                        <label htmlFor="radio-2" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                          Option 2
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Badges & Alerts */}
          <Section>
            <Text variant="h2" className="mb-6">Badges & Alerts</Text>
            
            <Text variant="h4" className="mb-4">Badges</Text>
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            
            <Text variant="h4" className="mb-4">Alerts</Text>
            <div className="space-y-4">
              <div className="alert-info">
                <div className="flex">
                  <FiInfo className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <Text variant="small" weight="medium">Informational message</Text>
                    <Text variant="small">This is an info alert — check it out!</Text>
                  </div>
                </div>
              </div>
              
              <div className="alert-success">
                <div className="flex">
                  <FiCheck className="h-5 w-5 text-green-400 mr-3" />
                  <div>
                    <Text variant="small" weight="medium">Success message</Text>
                    <Text variant="small">This is a success alert — check it out!</Text>
                  </div>
                </div>
              </div>
              
              <div className="alert-warning">
                <div className="flex">
                  <FiAlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
                  <div>
                    <Text variant="small" weight="medium">Warning message</Text>
                    <Text variant="small">This is a warning alert — check it out!</Text>
                  </div>
                </div>
              </div>
              
              <div className="alert-danger">
                <div className="flex">
                  <FiX className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <Text variant="small" weight="medium">Error message</Text>
                    <Text variant="small">This is an error alert — check it out!</Text>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Gradients */}
          <Section>
            <Text variant="h2" className="mb-6">Gradients</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(GRADIENTS).map(([name, classes]) => (
                <div key={name} className={`${classes} h-24 rounded-lg p-4`}>
                  <Text color="white" weight="medium">{name}</Text>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </PageTransition>
  );
} 