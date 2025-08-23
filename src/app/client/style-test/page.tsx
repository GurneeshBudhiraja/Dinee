"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

export default function StyleTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tailwind v4 Style Test
          </h1>
          <p className="text-gray-600">
            Testing the new custom color theme with Tailwind CSS v4
          </p>
        </div>

        {/* Button Tests */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Button Components</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive Button</Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small Button</Button>
                <Button size="md">Medium Button</Button>
                <Button size="lg">Large Button</Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button loading>Loading Button</Button>
                <Button disabled>Disabled Button</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Tests */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Badge Components</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Input Tests */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Input Components</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Basic Input"
                placeholder="Enter some text..."
                helperText="This is a helper text"
              />

              <Input
                label="Email Input"
                type="email"
                placeholder="Enter your email"
                required
              />

              <Input
                label="Input with Error"
                placeholder="This has an error"
                error="This field is required"
              />

              <Input
                label="Disabled Input"
                placeholder="This is disabled"
                disabled
                value="Disabled value"
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Theme Test */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Custom Color Theme</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Primary
                </div>
                <p className="text-sm text-gray-600">#2563EB</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Accent
                </div>
                <p className="text-sm text-gray-600">#06B6D4</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-green-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Success
                </div>
                <p className="text-sm text-gray-600">#10B981</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-amber-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Warning
                </div>
                <p className="text-sm text-gray-600">#F59E0B</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-red-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Danger
                </div>
                <p className="text-sm text-gray-600">#EF4444</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-slate-800 rounded-lg flex items-center justify-center text-white font-medium">
                  Text Primary
                </div>
                <p className="text-sm text-gray-600">#1E293B</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-slate-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Text Secondary
                </div>
                <p className="text-sm text-gray-600">#64748B</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center justify-center text-gray-900 font-medium">
                  Background
                </div>
                <p className="text-sm text-gray-600">#F9FAFB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Utility Classes Test */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Custom Utility Classes</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Custom Button Utilities:
                </p>
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm">
                    Custom Primary
                  </button>
                  <button className="btn btn-secondary btn-md">
                    Custom Secondary
                  </button>
                  <button className="btn btn-outline btn-lg">
                    Custom Outline
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Custom Card Utilities:
                </p>
                <div className="card">
                  <div className="card-header">
                    <h3 className="font-medium">Card Header</h3>
                  </div>
                  <div className="card-content">
                    <p className="text-sm text-gray-600">
                      This is card content using custom utilities.
                    </p>
                  </div>
                  <div className="card-footer">
                    <p className="text-xs text-gray-500">Card Footer</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Custom Badge Utilities:
                </p>
                <div className="flex gap-2">
                  <span className="badge badge-primary">Primary Badge</span>
                  <span className="badge badge-success">Success Badge</span>
                  <span className="badge badge-warning">Warning Badge</span>
                  <span className="badge badge-danger">Danger Badge</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
